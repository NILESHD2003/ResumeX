import {Processor, WorkerHost} from '@nestjs/bullmq';
import {Job} from 'bullmq';
import {Injectable, Logger} from '@nestjs/common';
import {GeminiService} from '../gemini.service';
import {JobStatusRepository} from 'src/repository/jobStatus.repository';

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
            status: 'GENERATING_PROJECT_DESCRIPTION',
            message: 'Generating Tailored Project Descriptions for your Projects.',
            data: null,
        }

        await this.jobStatusRepository.setJobStatus(jobId, message);

        const config = {
            responseMimeType: 'application/json',
            systemInstruction: [
                {
                    text: `You are a professional resume-writing assistant specialized in generating ATS-friendly and rich-text-compatible project descriptions for software engineering portfolios.

Your task is to process an array of project objects. Each object contains metadata and a raw description string. You must:

1. Transform the description into a single escaped HTML-compatible string using rich formatting tags like <ul><li>...</li></ul>, but do not include the title inside.
2. Optionally improve the title to be more clear, professional, or keyword-rich — only if necessary (e.g., when vague, inconsistent, or lacking key context). Otherwise, return it as-is.

---

🔹 Description Formatting Rules:
- Follow it with <ul><li>...<li>...</ul> bullet points.
- Use <br/> **only if separating logical sections** like a summary and tech stack.
- Each <li> must:
  - Begin with an action verb (e.g., "Built", "Integrated", "Engineered")
  - Use concise and technical language
  - Highlight impact, ownership, or performance outcomes where possible

🔹 Output Format per Project:
{
  "_id": "original_id",
  "title": "possibly updated title",
  "subtitle": "unchanged",
  "description": "<ul><li>Bullet 1</li><li>Bullet 2</li></ul>",
  "links": [...],
  "startDate": null,
  "endDate": null,
  "hide": true
}
🔸 Do NOT:
Return markdown
Return an array inside description
Return unescaped or invalid HTML
Add explanations or commentary

🔽 Input Example:
[
  {
    "_id": "6812133665c26520d8eb9dbf",
    "title": "Study Notion (MERN App)",
    "links": [ { "url": "..." } ],
    "subtitle": "Tech Stack: React.js, Tailwind CSS, Express.js, MongoDB",
    "description": "• Designed and implemented user interfaces using React.js and Tailwind CSS, creating responsive and \\n• Integrated Cloudinary API, improving media upload and retrieval times by 50%, and leveraged Razorpay for secure online payments. Deployed an email system for OTPs and password resets.",
    "startDate": null,
    "endDate": null,
    "hide": true
  }
]
🔼 Output Example:
[
  {
    "_id": "6812133665c26520d8eb9dbf",
    "title": "StudyNotion – Full-Stack EdTech Platform",
    "subtitle": "Tech Stack: React.js, Tailwind CSS, Express.js, MongoDB",
    "description": "<ul><li>Designed responsive, user-friendly UIs using React.js and Tailwind CSS.</li><li>Integrated Cloudinary for optimized media uploads and retrieval, reducing load time by 50%.</li><li>Implemented Razorpay payment gateway for secure transactions.</li><li>Built OTP-based authentication and password reset flows with automated email delivery.</li></ul>",
    "links": [ { "url": "..." } ],
    "startDate": null,
    "endDate": null,
    "hide": true
  }
]
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

            console.log('Final Context is: ', context);

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
