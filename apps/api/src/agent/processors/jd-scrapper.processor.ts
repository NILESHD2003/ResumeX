import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { GeminiService } from '../gemini.service';
import { JDAnalyzerProducer } from '../queues/jd-analyzer.producer';
import { JobStatusRepository } from 'src/repository/jobStatus.repository';

@Processor('jd-scrapper')
@Injectable()
export class JDScrapperProcessor extends WorkerHost{
  private readonly logger = new Logger(JDScrapperProcessor.name);
  constructor(
    private geminiService: GeminiService,
    private jdAnalyzerProducer: JDAnalyzerProducer,
    private jobStatusRepository: JobStatusRepository,
  ) {
    super();
  }

  async process(job: Job) {
    const model = 'gemini-2.5-flash-preview-04-17';
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
      status: 'SCRAPPING_JOB_LINK',
      message: 'Scraping Job Description from provided Job Link.',
      data: null,
    };

    await this.jobStatusRepository.setJobStatus(jobId, message);

    const config = {
      responseMimeType: 'application/json',
      systemInstruction: [
        {
          text: `You are a web scraping agent.

          Your only task is to extract and return the **raw job description** from a given job posting URL. Do not summarize, analyze, restructure, or modify the content in any way.

          Follow these rules strictly:
          - Fetch and parse the webpage at the given URL.
          - Identify and extract the section that contains the job description.
          - Return the job description content as-is, preserving formatting where possible (e.g., headings, bullet points).
          - If the page is JavaScript-heavy and content cannot be found, return a message: "JavaScript-rendered content. Unable to scrape directly."
          - Do not include any commentary, explanation, or metadata.
          - Do not hallucinate or fabricate any content not present on the page.

          Your goal is to act as a reliable extractor of job description text from real-world job board and career portal URLs.

          You are not responsible for analyzing the job description. Just return it exactly as seen on the page.
`,
        },
      ],
    };

    const jobLink = job.data.context.jobLink || '';
    const userData = job.data.userData || '';

    if (!jobLink) {
      this.logger.error('No Job Link found in Job Data', job.data);
      return {
        error: 'No Job Link found',
        data: job.data,
        processedAt: new Date().toISOString(),
      };
    }

    if (!userData) {
      this.logger.error('No User Data found in Job Data', job.data);
      return {
        error: 'No User Data found',
        data: job.data,
        processedAt: new Date().toISOString(),
      };
    }

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `Job Link ${jobLink}`,
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
        this.logger.error('Empty Response from Gemini', job.data);
        throw new Error('Empty Response from Gemini');
      }

      let parsedResponse;
      try {
        parsedResponse = typeof res === 'string' ? JSON.parse(res) : res;
      } catch (error) {
        this.logger.error('Failed to parse Gemini Response as JSON', error);
        throw new Error('Invalid JSON response from Gemini');
      }

      let context = {
        jobDescription: parsedResponse.job_description,
      };

      await this.jdAnalyzerProducer.addJobToQueue(jobId, context, userData);

      message = {
        status: 'JOB_DESCRIPTION_SCRAPPED',
        message: 'Job Description successfully parsed.',
        data: parsedResponse,
      };

      await this.jobStatusRepository.setJobStatus(jobId, message);

      return {
        data: job.data,
        result: parsedResponse,
        processedAt: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error in JD Scrapper Processor ', error);
      message = {
        status: 'ERROR',
        message: error.toString() || 'Unknown error in JD Scrapper Processor',
        data: null,
      };
      await this.jobStatusRepository.setJobStatus(jobId, message);
      return {
        error: error || 'Unknow Error in JD Scrapper Processor',
        data: job.data,
        processedAt: new Date().toISOString(),
      };
    }
  }
}
