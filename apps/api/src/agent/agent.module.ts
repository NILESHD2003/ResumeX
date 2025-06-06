import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          username: configService.get<string>('REDIS_USERNAME'),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
    BullModule.registerQueue({ name: 'jd-analysis' }),
    BullModule.registerQueue({ name: 'skills-ranker' }),
    BullModule.registerQueue({ name: 'projects-ranker' }),
    BullModule.registerQueue({ name: 'project-description-generator' }),
    BullModule.registerQueue({ name: 'jd-scrapper' }),
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