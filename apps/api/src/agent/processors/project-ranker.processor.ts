import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { GeminiService } from '../gemini.service';
import { Logger } from '@nestjs/common';
import { JobStatusRepository } from 'src/repository/jobStatus.repository';
import { SkillRankerProducer } from '../queues/skill-ranker.producer';

@Processor('projects-ranker')
@Injectable()
export class ProjectsRankerProcessor extends WorkerHost {
  private readonly logger = new Logger(ProjectsRankerProcessor.name);
  constructor(
    private geminiService: GeminiService,
    private jobStatusRepository: JobStatusRepository,
    private skillRankerProducer: SkillRankerProducer,
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
      status: 'RANKING_PROJECTS',
      message: 'Ranking your projects based on Required Skills and Job Description.',
      data: null,
    }
    
    await this.jobStatusRepository.setJobStatus(jobId, message);

    const config = {
      responseMimeType: 'application/json',
      systemInstruction: [
        {
          text: `You are a Projects Ranking Agent.

          Your job is to **evaluate and rank the user's projects** based on how well each project aligns with a given parsed job description (JD) and the user's skill relevance scores.

          You are provided:
          - "projects": An array of user projects. Each project includes:
            - "title": Name of the project
            - "description": What the project does
            - "technologiesUsed": List of technologies or tools used
          - "parsedJobDescription": Structured object with:
            - "requiredSkills": Core skills explicitly required
            - "preferredSkills": Additional nice-to-have skills
            - "roleTitle": The job title

          Your task:
          1. For each project, compare the technologies used and description against:
             - Required and preferred skills in the JD.
          2. Assign a "relevance_score" (0–100) to each project:
             - Projects using high-scoring sub-skills and matching JD skills should score higher.
             - Projects only loosely related should score lower.
             - If a project is not relevant to the JD, assign a low score.

          Output Format (JSON):
          {
            "rankedProjects": [
              {
                "title": string,
                "relevance_score": number (0–100),
                "matchedSkills": [list of matched skills from JD or rankedSubSkills]
              },
              ...
            ],
            "unsortedProjectScores": [
              {
                "title": string,
                "relevance_score": number,
                "matchedSkills": [...]
              },
              ...
            ],
            "avgProjectScore": number
          }

          Instructions:
          - Do not suggest improvements.
          - Do not summarize.
          - Do not hallucinate project capabilities.
          - Only use what's explicitly mentioned in the project data.
`,
        },
      ],
    };

    const model = 'gemini-2.0-flash-lite';
    const userProject = job.data.userData.projects || '';
    const parsedJobDescription = context.analysedJobDescription;

    if (!userProject) {
      this.logger.error('No User Projects found in the job data', job.data);
      return {
        error: 'No User Project found',
        data: job.data,
        processedAt: new Date().toISOString(),
      };
    }

    if (!parsedJobDescription) {
      this.logger.error(
        'No Parsed Job Description found in the job data',
        job.data,
      );
      return {
        error: 'No Ranked User Skills found',
        data: job.data,
        processedAt: new Date().toISOString(),
      };
    }

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `Parsed Job Description: ${JSON.stringify(parsedJobDescription)}
            User Projects: ${JSON.stringify(userProject)}
            `,
            context: JSON.stringify(job.data.context),
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

      context.rankedProjects = parsedResponse;

      message = {
        status: 'PROJECTS_RANKED',
        message: 'Projects ranking completed',
        data: parsedResponse,
      }

      await this.jobStatusRepository.setJobStatus(jobId, message);

      await this.skillRankerProducer.addJobToQueue(jobId, context, job.data.userData);

      return {
        data: job.data,
        result: parsedResponse,
        processedAt: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error in Project Rank Processor ', error);
      message = {
        status: 'ERROR',
        message: error.toString() || 'Unknown error in Project Rank Processor',
        data: null,
      }
      await this.jobStatusRepository.setJobStatus(jobId, message);
      return {
        error: error || 'Unknow Error in Project Rank Processor',
        data: job.data,
        processedAt: new Date().toISOString(),
      };
    }
  }
}
