import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { User } from 'src/Mongo/Schema/user.schema';

@Injectable()
export class ProjectRankerProducer {
  constructor(
    @InjectQueue('projects-ranker')
    private readonly projectRankerQueue: Queue,
  ) {}

  async addJobToQueue(jobId: string, context: object, userData: User) {
    await this.projectRankerQueue.add(
      'project-ranker',
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
