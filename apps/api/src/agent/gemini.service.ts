import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiService {
  private ai: GoogleGenAI;
  constructor(private configService: ConfigService) {
    this.ai = new GoogleGenAI({
      apiKey: this.configService.get<string>('GEMINI_API_KEY'),
    });
  }

  async generateContent(model, config, contents) {
    const response = await this.ai.models.generateContent({
      model,
      config,
      contents,
    });

    return response.candidates[0].content.parts[0].text;
  }
}
