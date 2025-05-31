import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { GeminiService } from '../gemini.service';
import { JobStatusRepository } from 'src/repository/jobStatus.repository';

@Processor('project-description-generator')
@Injectable()
export class ProjectDescriptionGeneratorProcessor extends WorkerHost {
  private readonly logger = new Logger(ProjectDescriptionGeneratorProcessor.name);
  constructor(
    private geminiService: GeminiService,
    private jobStatusRepository: JobStatusRepository,
  ) {
    super();
  }
  async process(job: Job) {
    const jobId = job.data.jobId;

    if(!jobId){
      this.logger.error('No Job ID found in Job Data', job.data);
      return {
        error: 'No Job ID found',
        data: job.data,
        processedAt: new Date().toISOString(),
      };
    }

    let context = job.data.context;

    if(!context){
      this.logger.error('No Context found in Job Data', job.data);
      return {
        error: 'No Context found',
        data: job.data,
        processedAt: new Date().toISOString(),
      };
    }
    
    let message = {
      status: 'GENERATING_PROJECT_DESCRIPTION',
      message: 'Generating Tailored Project Descriptions for your Projects.',
      data: null,
    }
    
    await this.jobStatusRepository.setJobStatus(jobId, message);
    
    const config = {
      responseMimeType: 'application/json',
      systemInstruction: [
        {
          text: `You are a professional resume-writing assistant specialized in generating ATS-friendly and rich-text-compatible project descriptions for software engineering projects.
    
    Your task is to generate a single HTML-compatible string for each project, summarizing its key features using bullet points. The format should be optimized for rendering inside resume builders or platforms that support rich text.
    
    🔹 Description Requirements:
    - Start the string with a <strong> tag containing the project title.
    - Follow with <ul> and <li> tags for each bullet point.
    - Use <br/> only if necessary to separate major sections (e.g., summary vs tech stack).
    - Each bullet must use action verbs and technical terminology.
    - Keep each <li> short, focused, and impact-driven.
    - Be ATS-friendly: focus on tech, responsibilities, and measurable outcomes (when possible).
    
    🔹 Output Format:
    {
      "projectDescription": "<strong>Reddit Clone</strong><ul><li>Developed a Reddit clone using Flutter and Firebase, supporting real-time data sync and auth.</li><li>Used Riverpod for state management to maintain clean architecture and scalability.</li><li>Implemented upvote/downvote mechanics and nested comments.</li><li>Deployed using Firebase Hosting and integrated FCM for notifications.</li></ul>"
    }
    
    🚫 Do not return an array.
    ✅ Return a **single escaped string** that includes rich text (HTML-compatible) tags.
    ✅ Format must be consistent for each project.
    `
        }
      ],
    };

    const model = 'gemini-2.0-flash-lite';
    const parsedJobDescription = context.analysedJobDescription;
    const projectData = job.data.userData.projects;

    if (!parsedJobDescription) {
      this.logger.error('No Parsed Job Description found', job.data);
      return {
        error: 'No Parsed Job Description found',
        data: job.data,
        processedAt: new Date().toISOString(),
      };
    }

    if (!projectData) {
      this.logger.error('No User Project Data found in Job Data', job.data);
      return {
        error: 'No User Project Data found in Job Data',
        data: job.data,
        processedAt: new Date().toISOString(),
      };
    }

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `Project Data: ${JSON.stringify(projectData)} Parsed Job Description: ${JSON.stringify(parsedJobDescription)} Ranked Skills: ${JSON.stringify(context.rankedSkills)}`,
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
        throw new Error('Empty Response from Gemini');
      }

      let parsedResponse;
      try {
        parsedResponse = typeof res === 'string' ? JSON.parse(res) : res;
      } catch (error) {
        this.logger.error('Failed to parse Gemini Response as JSON', error);
        throw new Error('Invalid JSON response from Gemini');
      }

      message = {
        status: 'PROJECT_DESCRIPTION_GENERATED',
        message: 'Project description successfully generated.',
        data: parsedResponse,
      }

      await this.jobStatusRepository.setJobStatus(jobId, message);
      context.generatedProjectDescription = parsedResponse;

      message = {
        status: 'COMPLETED',
        message: 'Job Completed Successfully. All tasks are completed.',
        data: `HERE I WILL SEND COMPLETE OBJECT LATER__${JSON.stringify(context)}`,
      }

      await this.jobStatusRepository.setJobStatus(jobId, message);

      return {
        data: job.data,
        result: parsedResponse,
        processedAt: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error in Project Description Generator Processor ', error);
      message = {
        status: 'ERROR',
        message: error.toString() || 'Unknown Error in Project Description Generator Processor',
        data: null,
      }
      await this.jobStatusRepository.setJobStatus(jobId, message);
      return {
        error:
          error || 'Unknow Error in Project Description Generator Processor',
        data: job.data,
        processedAt: new Date().toISOString(),
      };
    }
  }
}
