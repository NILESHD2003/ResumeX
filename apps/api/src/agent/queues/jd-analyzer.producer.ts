import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JDAnalyzerProducer {
  constructor(
    @InjectQueue('jd-analysis')
    private readonly jdAnalysisQueue: Queue,
  ) {}

  async addJobToQueue(jobId: string, context: object, userData: object) {
    await this.jdAnalysisQueue.add(
      'analyze-jd',
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
