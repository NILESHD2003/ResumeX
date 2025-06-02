import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { BullModule } from '@nestjs/bullmq';
import { JDAnalysisProcessor } from './processors/jd-analyzer.processor';
import { GeminiService } from './gemini.service';
import { SkillRankerProducer } from './queues/skill-ranker.producer';
import { AuthModule } from 'src/auth/auth.module';
import { SkillRankerProcessor } from './processors/skill-ranker.processor';
import { JDScrapperProcessor } from './processors/jd-scrapper.processor';
import { JDAnalyzerProducer } from './queues/jd-analyzer.producer';
import { ProjectRankerProducer } from './queues/project-ranker.producer';
import { ProjectsRankerProcessor } from './processors/project-ranker.processor';
import { ProjectDescriptionGeneratorProducer } from './queues/project-description-generator.producer';
import { ProjectDescriptionGeneratorProcessor } from './processors/project-description-generator.processor';
import { RepositoryModule } from 'src/repository/repository.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'jd-analysis',
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'skills-ranker',
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'projects-ranker',
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'project-description-generator',
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'jd-scrapper',
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    AuthModule,
    RepositoryModule,
  ],
  controllers: [AgentController],
  providers: [
    AgentService,
    GeminiService,
    JDScrapperProcessor,
    JDAnalyzerProducer,
    JDAnalysisProcessor,
    SkillRankerProducer,
    SkillRankerProcessor,
    ProjectRankerProducer,
    ProjectsRankerProcessor,
    ProjectDescriptionGeneratorProducer,
    ProjectDescriptionGeneratorProcessor,
  ],
})
export class AgentModule {}
