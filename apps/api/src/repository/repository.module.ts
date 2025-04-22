import { Global, Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InvitationRepository } from './invitation.repository';
import { MongoModule } from '../Mongo/mongo.module';

@Global()
@Module({
    imports: [MongoModule],
    providers: [UserRepository, InvitationRepository],
    exports: [UserRepository, InvitationRepository],
})
export class RepositoryModule {}
