import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class JobStatusRepository {
  private readonly client;

  constructor(private readonly redisService: RedisService) {
    this.client = this.redisService.getClient();
  }

  // async setJobStatus(jobId: string, status) {
  //   await this.client.set(`job:status:${jobId}`, status, {
  //     EX: 3600,
  //   });
  // }

  async setJobStatus(jobId: string, status) {
    status.timestamp = new Date().toISOString();
    await this.client.lPush(`job:status:${jobId}`, JSON.stringify(status), {
      EX: 60 * 2,
    });
  }

  async getJobStatus(jobId: string) {
    return await this.client.lRange(`job:status:${jobId}`, 0, -1);
  }

  async deleteJobStatus(jobId: string) {
    await this.client.del(`job:status:${jobId}`);
  }
}
