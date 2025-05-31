import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { GeminiService } from '../gemini.service';
import { ProjectDescriptionGeneratorProducer } from '../queues/project-description-generator.producer';
import { JobStatusRepository } from 'src/repository/jobStatus.repository';

@Processor('skills-ranker')
@Injectable()
export class SkillRankerProcessor extends WorkerHost {
  private readonly logger = new Logger(SkillRankerProcessor.name);
  constructor(
    private geminiService: GeminiService,
    private jobStatusRepository: JobStatusRepository,
    private projectDescriptionGeneratorProducer: ProjectDescriptionGeneratorProducer,
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

    let context = job.data.context;

    if (!context) {
      this.logger.error('No Context found in Job Data', job.data);
      return {
        error: 'No Context found',
        data: job.data,
        processedAt: new Date().toISOString(),
      };
    }
    let message = {
      status: 'RANKING_SKILLS',
      message:
        'Ranking your skills based on Required Skills and Job Description and Your Projects.',
      data: null,
    };

    await this.jobStatusRepository.setJobStatus(jobId, message);
    const config = {
      responseMimeType: 'application/json',
      systemInstruction: [
        {
          text: `You are an advanced AI agent designed to evaluate and rank a user's technical skills based on their alignment with a target job profile.

You will be provided with a 'context' object that includes structured data such as job description insights, user skills, project experience, and other relevant information. Use this context to conduct a comprehensive evaluation.

Your goal is to produce a structured JSON output containing the following:

1️⃣ SubSkill Scores (Ranked Individually):
For each sub-skill:
- name: Name of the sub-skill.
- category: "Preferred" or "Not Preferred" based on its alignment with the job requirements inferred from the context.
- relevance_score: A score from 0–100 indicating how relevant the sub-skill is to the target role.

2️⃣ Ranked Main Skills (Grouped and Averaged):
For each main skill category:
- name: Name of the main skill group (e.g., "Backend", "Soft Skills").
- subSkills: Names of the sub-skills that fall under this category.
- category: "Preferred" or "Not Preferred", based on the majority label of its sub-skills.
- relevance_score: Average of the relevance scores of its sub-skills.

3️⃣ Average Relevance by Skill Category:
Display a concise summary of the average relevance score for each main skill category.

4️⃣ Recommended Skills (Based on Deep Analysis):
Identify missing but critical skills relevant to the job context. Organize recommendations into these categories:
- Technical
- Tools and Technology
- Soft Skills
- Methodologies
- Other Relevant Skills

Recommended Output Format:
{
  subSkillScores: [...],
  rankedMainSkills: [...],
  averageRelevanceByCategory: [...],
  recommendedSkills: [
    {
      name: "Technical",
      Skills: ["Java", "Python", "Dart"]
    },
    {
      name: "Tools and Technology",
      Skills: ["Git", "Docker"]
    },
    ...
  ]
}

⚠️ Requirements:
- Use the context provided without assuming a fixed structure.
- Ensure recommendations are aligned with industry expectations and role suitability.
- Do not repeat user skills unless you suggest a significant extension (e.g., "Advanced React").
- Output valid JSON only, with no extra commentary.`,
        },
      ],
    };

    const model = 'gemini-2.0-flash-lite';
    const parsedJobDescription = job.data.context.analysedJobDescription || '';
    const userData = job.data.userData || '';

    if (!userData) {
      this.logger.error('No User Data found in the job data', job.data);
      return {
        error: 'No User Data found',
        data: job.data,
        processedAt: new Date().toISOString(),
      };
    }

    if (!userData.skills) {
      this.logger.error('No User Skills found in the job data', job.data);
      return {
        error: 'No User skills found',
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
        error: 'No Parsed Job Description found',
        data: job.data,
        processedAt: new Date().toISOString(),
      };
    }

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `User Skills: ${JSON.stringify(userData.skills)} Parsed Job Description: ${JSON.stringify(parsedJobDescription)} Ranked Project Experience: ${JSON.stringify(context.rankedProjects)}`,
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
        this.logger.error('Failed to parse Gemini Response as JSON', error);
        throw new Error('Invalid JSON response from Gemini');
      }
      
      context.rankedSkills = parsedResponse;

      message = {
        status: 'SKILLS_RANKED',
        message: 'Skill Ranking Completed',
        data: parsedResponse,
      };

      await this.jobStatusRepository.setJobStatus(jobId, message);

      await this.projectDescriptionGeneratorProducer.addJobToQueue(
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
      this.logger.error('Error in Skill Rank Processor: ', error);
      message = {
        status: 'ERROR',
        message: error.toString() || 'Unknown Error in Skill Rank Processor',
        data: null,
      };
      await this.jobStatusRepository.setJobStatus(jobId, message);
      return {
        error: error || 'Unknow Error in Skill Rank Processor',
        data: job.data,
        processedAt: new Date().toISOString(),
      };
    }
  }
}
