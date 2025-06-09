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

You will receive a 'context' object that includes:
- A job description summary or insights
- A list of user skills (in a structured format)
- Optional user project experience

Your task is to analyze this context and produce a structured JSON output in the **same format as the input skills list**, but with additional evaluation metadata.

---

🧠 Evaluation Requirements:
For each main skill category in the input:
- Preserve the \`_id\`, \`name\`, \`subSkills\`, \`level\`, and \`hide\` fields.
- Add a new field: \`"evaluation"\` with the following structure:
  {
    "category": "Preferred" | "Not Preferred",   // based on subSkill-job alignment
    "relevance_score": Number (0–100),           // average score across subSkills
    "subSkillScores": [                          // detailed scoring
      {
        "name": String,
        "category": "Preferred" | "Not Preferred",
        "relevance_score": Number (0–100)
      }
    ]
  }

Also return a separate object:
**recommendedSkills**: A list of missing but relevant skills categorized as:
- Technical
- Tools and Technology
- Soft Skills
- Methodologies
- Other Relevant Skills

---

🎯 Output Format (JSON only, no commentary):
{
  "rankedSkills": [
    {
      "_id": "...",
      "name": "...",
      "subSkills": [...],
      "level": "...",
      "hide": false,
      "evaluation": {
        "category": "Preferred",
        "relevance_score": 87,
        "subSkillScores": [
          {
            "name": "React.js",
            "category": "Preferred",
            "relevance_score": 90
          },
          ...
        ]
      }
    },
    ...
  ],
  "recommendedSkills": [
    {
      "name": "Technical",
      "Skills": ["Fastify", "gRPC"]
    },
    {
      "name": "Tools and Technology",
      "Skills": ["Azure", "Kubernetes"]
    }
  ]
}

⚠️ Instructions:
- Use only the data in the provided context — don’t hallucinate structure.
- If a subSkill is not relevant to the job description, score it lower and mark it as "Not Preferred".
- Recommend only skills that are **missing or lightly covered** and are important for the role.
- Output valid JSON only.`,
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

    // console.log(contents[0].parts[0].text);

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

      // console.log(parsedResponse.rankedSkills[0].evaluation.subSkillScores);
      
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
