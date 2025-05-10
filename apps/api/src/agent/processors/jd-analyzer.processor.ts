import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { GeminiService } from '../gemini.service';
import { Type } from '@google/genai';

@Processor('jd-analysis')
@Injectable()
export class JDAnalysisProcessor extends WorkerHost {
  constructor(private geminiService: GeminiService) {
    super();
  }
  async process(job: Job) {
    const config = {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        required: ['roleTitle', 'requiredSkills', 'responsibilities'],
        properties: {
          roleTitle: {
            type: Type.STRING,
          },
          requiredSkills: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },
          preferredSkills: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },
          toolsAndTechnologies: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },
          responsibilities: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },
        },
      },
      systemInstruction: [
        {
          text: `You are a Job Description Analyser Agent. Your task is to extract structured JSON from job descriptions.
        Only return valid JSON, no extra text.

        The JSON should include the following keys:
        - roleTitle (string)
        - requiredSkills (array of strings)
        - preferredSkills (array of strings)
        - toolsAndTechnologies (array of strings)
        - responsibilities (array of strings)`,
        },
      ],
    };
    const model = 'gemini-2.0-flash-lite';
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: job.data.jobDescription,
          },
        ],
      },
    ];

    const res = await this.geminiService.generateContent(
      model,
      config,
      contents,
    );

    // TODO: Enqueue Job for Next Agent

    return {
      data: job,
      processedAt: new Date().toISOString(),
    };
  }
}
