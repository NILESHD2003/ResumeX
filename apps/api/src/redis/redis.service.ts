import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from '@redis/client';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: RedisClientType;

  constructor(private configService: ConfigService) {
    this.client = createClient({
      url: this.configService.get('REDIS_URL'),
    });
  }

  private async connect() {
    await this.client.connect();
  }

  private async disconnect() {
    await this.client.quit();
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
}
