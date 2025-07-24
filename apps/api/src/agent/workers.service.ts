import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Queue, Worker } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WorkersManagementService implements OnModuleInit {
  private readonly logger = new Logger(WorkersManagementService.name);

  private workers: Map<String, Worker> = new Map();
  private queues: Map<String, Queue> = new Map();

  constructor(
    @InjectQueue('jd-analysis')
    private readonly jdAnalysisQueue: Queue,
    @InjectQueue('jd-scrapper')
    private readonly jdScrapperQueue: Queue,
    @InjectQueue('skills-ranker')
    private readonly skillsRankerQueue: Queue,
    @InjectQueue('projects-ranker')
    private readonly projectsRankerQueue: Queue,
    @InjectQueue('project-description-generator')
    private readonly projectDescriptionGeneratorQueue: Queue,
    private readonly configService: ConfigService,
  ) {
    this.queues.set('jd-analysis', this.jdAnalysisQueue);
    this.queues.set('jd-scrapper', this.jdScrapperQueue);
    this.queues.set('skills-ranker', this.skillsRankerQueue);
    this.queues.set('projects-ranker', this.projectsRankerQueue);
    this.queues.set(
      'project-description-generator',
      this.projectDescriptionGeneratorQueue,
    );
  }

  async onModuleInit() {
    this.logger.log('Worker Management Service initialized');
  }

  async pauseWorker(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      this.logger.error(`Queue ${queueName} not found`);
      return;
    }

    try {
      await queue.pause();
      this.logger.log(`Paused worker for queue: ${queueName}`);
    } catch (error) {
      this.logger.error(
        `Failed to pause worker for queue ${queueName}: ${error}`,
      );
    }
  }

  async resumeWorker(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      this.logger.error(`Queue ${queueName} not found`);
      return;
    }

    try {
      await queue.resume();
      this.logger.log(`Resumed worker for queue: ${queueName}`);
    } catch (error) {
      this.logger.error(
        `Failed to resume worker for queue ${queueName}: ${error}`,
      );
    }
  }

  async pauseAllWorkers(): Promise<void> {
    for (const [queueName, queue] of this.queues.entries()) {
      try {
        await queue.pause();
        this.logger.log(`Paused worker for queue: ${queueName}`);
      } catch (error) {
        this.logger.error(
          `Failed to pause worker for queue ${queueName}: ${error}`,
        );
      }
    }
  }

    async resumeAllWorkers(): Promise<void> {
        for (const [queueName, queue] of this.queues.entries()) {
        try {
            await queue.resume();
            this.logger.log(`Resumed worker for queue: ${queueName}`);
        } catch (error) {
            this.logger.error(
            `Failed to resume worker for queue ${queueName}: ${error}`,
            );
        }
        }
    }

    async retryFailedJobs(): Promise<void> {
        for (const [queueName, queue] of this.queues.entries()) {
        try {
            // Get all failed jobs
            const failedJobs = await queue.getFailed(0, -1);
            
            // Get all delayed jobs (waiting for retry)
            const delayedJobs = await queue.getDelayed(0, -1);
            
            this.logger.log(`Found ${failedJobs.length} failed jobs and ${delayedJobs.length} delayed jobs in queue: ${queueName}`);
            
            // Retry failed jobs that failed due to degradation
            for (const job of failedJobs) {
            try {
                const failedReason = job.failedReason;
                if (failedReason && failedReason.includes('GeminiDegradationError')) {
                await job.retry();
                this.logger.log(`Retried degradation-failed job ${job.id} in queue: ${queueName}`);
                }
            } catch (retryError) {
                this.logger.error(`Failed to retry job ${job.id} in queue ${queueName}: ${retryError}`);
            }
            }

            // Promote delayed jobs that are waiting due to degradation errors
            for (const job of delayedJobs) {
            try {
                const failedReason = job.failedReason;
                if (failedReason && failedReason.includes('GeminiDegradationError')) {
                await job.promote();
                this.logger.log(`Promoted degradation-delayed job ${job.id} in queue: ${queueName}`);
                }
            } catch (promoteError) {
                this.logger.error(`Failed to promote job ${job.id} in queue ${queueName}: ${promoteError}`);
            }
            }
        } catch (error) {
            this.logger.error(
            `Failed to retry failed jobs for queue ${queueName}: ${error}`,
            );
        }
        }
    }

    // TODO: Implement methods like Clean Completed Jobs, Clean Failed Jobs, Get Queue Backpressure etc.
}
