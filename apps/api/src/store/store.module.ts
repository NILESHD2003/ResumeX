import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import {RepositoryModule} from "../repository/repository.module";
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [RepositoryModule, AuthModule],
  controllers: [StoreController],
  providers: [StoreService]
})
export class StoreModule {}
