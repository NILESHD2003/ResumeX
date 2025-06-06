import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectDescriptionGeneratorProducer {
  constructor(
    @InjectQueue('project-description-generator')
    private readonly projectDescriptionGenerator: Queue,
  ) {}

  async addJobToQueue(
    jobId: string,
    context: object,
    userData: object,
  ) {
    await this.projectDescriptionGenerator.add(
      'generate-project-description',
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
