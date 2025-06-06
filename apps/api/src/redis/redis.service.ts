import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from '@redis/client';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: RedisClientType;

  constructor(private configService: ConfigService) {
    // Get Redis configuration
    const redisUrl = this.configService.get<string>('REDIS_URL');
    const redisHost = this.configService.get<string>('REDIS_HOST');
    const redisPort = this.configService.get<number>('REDIS_PORT');
    const redisUsername = this.configService.get<string>('REDIS_USERNAME');
    const redisPassword = this.configService.get<string>('REDIS_PASSWORD');

    let clientConfig: any;

    // Use URL if provided and valid, otherwise use individual components
    if (redisUrl && redisUrl.trim() !== '') {
      clientConfig = {
        url: redisUrl,
      };
    } else if (redisHost) {
      // Construct connection from individual components
      clientConfig = {
        socket: {
          host: redisHost,
          port: redisPort || 6379,
        },
        username: redisUsername || 'default',
        password: redisPassword,
      };
    } else {
      throw new Error('Redis configuration missing. Provide either REDIS_URL or REDIS_HOST');
    }

    // Add common socket options
    clientConfig.socket = {
      ...clientConfig.socket,
      reconnectStrategy: (retries) => {
        const delay = Math.min(retries * 50, 2000);
        this.logger.log(`Reconnecting to Redis in ${delay}ms...`);
        return delay;
      },
    };

    this.client = createClient(clientConfig);

    this.client.on('error', (err) => {
      this.logger.error('Redis client error', err);
    });

    this.client.on('reconnecting', () => {
      this.logger.log('Redis client reconnecting');
    });

    this.client.on('ready', () => {
      this.logger.log('Redis client ready');
    });

    this.client.on('connect', () => {
      this.logger.log('Redis client connected');
    });
  }

  private async connect() {
    try {
      if (this.client.isOpen) {
        this.logger.log('Redis client already connected');
        return;
      }

      await this.client.connect();
      this.logger.log('Redis connection established successfully');
    } catch (error) {
      this.logger.error('Error connecting to Redis', error);
      throw error;
    }
  }

  private async disconnect() {
    try {
      if (!this.client.isOpen) {
        this.logger.log('Redis client already disconnected');
        return;
      }

      await this.client.quit();
      this.logger.log('Redis connection closed successfully');
    } catch (error) {
      this.logger.error('Error disconnecting from Redis', error);
      throw error;
    }
  }

  async onModuleInit() {
    await this.connect();
    this.logger.log('Redis connected');
  }

  async onModuleDestroy() {
    await this.disconnect();
    this.logger.log('Redis disconnected');
  }

  getClient() {
    return this.client;
  }

  isConnected(): boolean {
    return this.client.isOpen;
  }
}