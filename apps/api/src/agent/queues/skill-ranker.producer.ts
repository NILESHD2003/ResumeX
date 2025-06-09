import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { User } from 'src/Mongo/Schema/user.schema';

@Injectable()
export class SkillRankerProducer {
  constructor(
    @InjectQueue('skills-ranker')
    private readonly skillRankerQueue: Queue,
  ) {}

  async addJobToQueue(jobId: string, context: object, userData: User) {
    await this.skillRankerQueue.add(
      'skill-rank',
      {
        jobId,
        context,
        userData,
        requestedAt: new Date().toISOString(),
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: {
          age: 60 * 60,
          count: 100,
        },
        removeOnFail: false,
      },
    );
  }
}
