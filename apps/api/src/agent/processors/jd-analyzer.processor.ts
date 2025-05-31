import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { GeminiService } from '../gemini.service';
import { ProjectRankerProducer } from '../queues/project-ranker.producer';
import { JobStatusRepository } from 'src/repository/jobStatus.repository';

@Processor('jd-analysis')
@Injectable()
export class JDAnalysisProcessor extends WorkerHost {
  private readonly logger = new Logger(JDAnalysisProcessor.name);
  constructor(
    private geminiService: GeminiService,
    private projectRankerProducer: ProjectRankerProducer,
    private jobStatusRepository: JobStatusRepository,
  ) {
    super();
  }
  async process(job: Job) {
    const jobId = job.data.jobId;

    if (!jobId) {
      this.logger.error('No Job ID found in Job Data', job.data);
      return {
        error: 'No Job ID found',
        data: job.data,
        processedAt: new Date().toISOString(),
      };
    }

    let message = {
      status: 'ANALYZING_JD',
      message: 'Analyzing Job Description for Key Information',
      data: null,
    }

    let context = job.data.context;

    if (!context) {
      this.logger.error('No Context found in Job Data', job.data);
      return {
        error: 'No Context found',
        data: job.data,
        processedAt: new Date().toISOString(),
      };
    }

    await this.jobStatusRepository.setJobStatus(jobId, message);
    const config = {
      responseMimeType: 'application/json',
      systemInstruction: [
        {
          text: `You are a Job Description Analyzer Agent. Your task is to extract structured JSON from job descriptions.
          Only return valid JSON, with no extra text or explanations.

          The JSON should include the following keys:

          roleTitle (string) — The main title or role of the job.

          requiredSkills (array of strings) — Core skills explicitly mentioned as required for the role.

          preferredSkills (array of strings) — Skills that are mentioned as advantageous but not mandatory.

          toolsAndTechnologies (array of strings) — Specific tools, technologies, programming languages, or platforms required or preferred.

          responsibilities (array of strings) — Key responsibilities, duties, and tasks associated with the role.

          educationQualifications (array of strings) — Required or preferred educational qualifications.

          experienceLevel (string) — The required experience level (e.g., "Fresher", "2-3 years", "Senior").

          location (string) — The primary location where the job is based.

          salaryRange (string) — The mentioned salary range, stipend, or CTC, if specified.

          employmentType (string) — The type of employment (e.g., "Full Time", "Part Time", "Internship").`,
        },
      ],
    };
    const model = 'gemini-2.0-flash-lite';

    const jobDescription = context.jobDescription || '';

    if (!jobDescription) {
      this.logger.error('No job description found in the job data context', job.data.context);
      return {
        error: 'No job description provided in job data context',
        data: job.data.context,
        processedAt: new Date().toISOString(),
      };
    }

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: jobDescription,
            context: JSON.stringify(context),
          },
        ],
      },
    ];

    try {
      const res = await this.geminiService.generateContent(
        model,
        config,
        contents,
      );

      if (!res) {
        throw new Error('Empty response from Gemini');
      }

      let parsedResponse;
      try {
        parsedResponse = typeof res === 'string' ? JSON.parse(res) : res;
      } catch (error) {
        this.logger.error('Failed to parse Gemini response as JSON', error);
        throw new Error('Invalid JSON response from Gemini');
      }

      context.analysedJobDescription = parsedResponse;

      message = {
        status: 'JD_ANALYZED',
        message: 'Job Description Analysis Completed',
        data: parsedResponse,
      }

      await this.jobStatusRepository.setJobStatus(jobId, message);

      await this.projectRankerProducer.addJobToQueue(
        jobId,
        context,
        job.data.userData,
      );

      return {
        data: job.data,
        result: parsedResponse,
        processedAt: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error in JD analysis processor:', error);
      message = {
        status: 'ERROR',
        message: error.toString() || 'Unknown error in JD analysis',
        data: null,
      }
      await this.jobStatusRepository.setJobStatus(jobId, message);
      return {
        error: error || 'Unknown error in JD analysis',
        data: job.data,
        processedAt: new Date().toISOString(),
      };
    }
  }
}
