import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class QuotasRepository {
  private readonly client;

  constructor(private readonly redisService: RedisService) {
    this.client = this.redisService.getClient();
  }

  async setGlobalQuotaUsage(modelName: string, usage: number, type: string) {
    const key = `quota:global:${modelName}:${type}`;

    const exists = await this.client.exists(key);

    if (!exists) {
      await this.client.set(key, usage, {
        EX: this.getTTLByType(type),
      });
    } else {
      await this.client.incrBy(key, usage);
    }
  }

  async getGlobalQuotaUsage(modelName: string, type: string) {
    return await this.client.get(`quota:global:${modelName}:${type}`);
  }

  private getTTLByType(type: string): number {
    switch (type.toLowerCase()) {
      case 'rpm':
        return 60; // 60 seconds
      case 'tpm':
        return 60;
      case 'rpd':
        return 86400; // 24 hours
      case 'tpd':
        return 86400;
      default:
        return 60; // default to 1 minute
    }
  }
}
