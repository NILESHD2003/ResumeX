import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { UserRepository } from 'src/repository/user.repository';
import { ObjectId } from 'mongodb';
import { JobStatusRepository } from 'src/repository/jobStatus.repository';

@Injectable()
export class AgentService {
  constructor(
    @InjectQueue('jd-analysis') private jdAnalysisQueue: Queue,
    @InjectQueue('jd-scrapper') private jdScrapperQueue: Queue,
    private readonly userRepository: UserRepository,
    private readonly jobStatusRepository: JobStatusRepository,
  ) {}

  async addNewJob(jobDescription: string, email: string) {
    const userData = await this.userRepository.findUserByEmail(email);

    if (!userData) {
      throw new Error(`User with email ${email} not found`);
    }
    const jobId = await this.createNewJobId();
    const jobMessage = {
      status: 'PENDING',
      message: 'Job Received and Pending for Processing.',
      data: null,
    }

    await this.jobStatusRepository.setJobStatus(jobId, jobMessage);

    const job = await this.jdAnalysisQueue.add('analyze-jd', {
      jobId,
      context: {
        jobDescription,
      },
      userData,
      requestedAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: 'JD analysis job submitted. Subscribe to job status API for updates.',
      jobId
    };
  }

  async addNewJobByJobLink(jobLink: string, email: string) {
    const userData = await this.userRepository.findUserByEmail(email);

    if (!userData) {
      throw new Error(`User with email ${email} not found`);
    }

    const jobId = await this.createNewJobId();

    const job = await this.jdScrapperQueue.add('jd-scrap', {
      jobId,
      context: {
        jobLink,
      },
      userData,
      requestedAt: new Date().toISOString(),
    });

    const jobMessage = {
      status: 'PENDING',
      message: 'Job Received and Pending for Processing.',
      data: null,
    }

    await this.jobStatusRepository.setJobStatus(jobId, jobMessage);

    return {
      success: true,
      message: 'JD Parsing job submitted. Subscribe to job status API for updates.',
      jobId,
    };
  }

  private async createNewJobId() {
    let newJobId = new ObjectId().toString();
    let job = await this.jobStatusRepository.getJobStatus(newJobId);
    while (job.length > 0) {
      newJobId = new ObjectId().toString();
      job = await this.jobStatusRepository.getJobStatus(newJobId);
    }
    return newJobId;
  }

  async getJobStatus(jobId: string) {
    const res = await this.jobStatusRepository.getJobStatus(jobId);
  
    // if (Array.isArray(res) && typeof res[0] === 'string') {
    //   const parsed = JSON.parse(res[0]);
  
    //   const [_, rawData] = parsed.data.split('__');
    //   const parsedData = JSON.parse(rawData);
  
    //   parsed.data = parsedData;
  
    //   console.log(parsed);
    //   return parsed;
    // }
  
    return res;
  }
}