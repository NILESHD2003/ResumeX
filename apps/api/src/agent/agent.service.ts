import { Injectable } from '@nestjs/common';
import { NewJobDto } from './dto/job.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class AgentService {
  constructor(@InjectQueue('jd-analysis') private jdAnalysisQueue: Queue) {}
  async addNewJob(body: NewJobDto) {
    const job = await this.jdAnalysisQueue.add('analyze-jd', body);

    return { message: 'JD analysis job submitted', jobId: job.id, data: job };
  }
}
