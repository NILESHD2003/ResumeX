import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JDAnalyzerProducer {
  constructor(
    @InjectQueue('jd-analysis')
    private readonly jdAnalysisQueue: Queue,
  ) {}

  async addJobToQueue(jdText: string, userId: string) {
    await this.jdAnalysisQueue.add(
      'analyze-jd',
      {
        jdText,
        userId,
        requestedAt: new Date().toISOString(),
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );
  }
}
