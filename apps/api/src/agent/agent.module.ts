import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { BullModule } from '@nestjs/bullmq';
import { JDAnalysisProcessor } from './processors/jd-analyzer.processor';
import { GeminiService } from './gemini.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'jd-analysis',
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  controllers: [AgentController],
  providers: [AgentService, JDAnalysisProcessor, GeminiService],
})
export class AgentModule {}
