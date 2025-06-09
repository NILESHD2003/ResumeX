import {Module, Global, OnModuleInit} from '@nestjs/common';
import {MongoService} from './mongo.service';

@Global()
@Module({
    providers: [MongoService],
    exports: [MongoService],
})

export class MongoModule implements OnModuleInit {
    constructor(private readonly mongoService: MongoService) {}

    async onModuleInit() {
        await this.mongoService.connect();
    }
}