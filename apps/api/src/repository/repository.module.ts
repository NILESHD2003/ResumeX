import { Global, Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InvitationRepository } from './invitation.repository';
import { MongoModule } from '../Mongo/mongo.module';
import { JobStatusRepository } from './jobStatus.repository';
import { RedisModule } from 'src/redis/redis.module';
import { QuotasRepository } from './quotas.repository';
import {ResumeStoreRepository} from "./resumeStore.repository";

@Global()
@Module({
    imports: [MongoModule, RedisModule],
    providers: [UserRepository, InvitationRepository, JobStatusRepository, QuotasRepository, ResumeStoreRepository],
    exports: [UserRepository, InvitationRepository, JobStatusRepository, QuotasRepository, ResumeStoreRepository],
})
export class RepositoryModule {}
