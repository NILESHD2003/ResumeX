import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { MongoModule } from './Mongo/mongo.module';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { RepositoryModule } from './repository/repository.module';
import { ProfileModule } from './profile/profile.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AgentModule } from './agent/agent.module';
import { RedisModule } from './redis/redis.module';
import { StoreModule } from './store/store.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongoModule,
    RepositoryModule,
    AuthModule,
    ProfileModule,
    CloudinaryModule,
    AgentModule,
    RedisModule,
    StoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
