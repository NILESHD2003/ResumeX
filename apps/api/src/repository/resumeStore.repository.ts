import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import { MongoService } from '../Mongo/mongo.service';
import { Resume, RESUME_COLLECTION } from '../Mongo/Schema/resume.schema';

@Injectable()
export class ResumeStoreRepository {
    private collection: Collection<Resume>;

    private readonly logger = new Logger(ResumeStoreRepository.name);

    constructor(private readonly mongo: MongoService) { }

    async onModuleInit() {
        const db = await this.mongo.getDb();
        this.collection = db.collection<Resume>(RESUME_COLLECTION);
    }

    async findResumeByUserId(userId: string): Promise<any | null> {
        try {
            return await this.collection.find({userId}).toArray();
        } catch (error) {
            this.logger.error('Something went wrong while performing Database operation: findResumeByUserId', error);
            return null;
        }
    }

    async findResumeById(id: string): Promise<Resume | null> {
        try {
            return await this.collection.findOne({ _id: new ObjectId(id) });
        } catch (error) {
            this.logger.error('Something went wrong while performing Database operation: findResumeById', error);
            return null;
        }
    }

    async createNewResume(id: string, data: Resume): Promise<Boolean> {
        try {
            const resume = await this.collection.insertOne({
                _id: new ObjectId(id),
                ...data
            });
            return resume.acknowledged;
        } catch (error) {
            this.logger.error(
                'Something went Wrong while performing Database Operation: createNewResume ',
                error,
            );
            return false;
        }
    }
}