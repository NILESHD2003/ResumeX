// mongo.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';

@Injectable()
export class MongoService {
    private readonly logger = new Logger(MongoService.name);
    private client: MongoClient;
    private db: Db;
    private connectionPromise: Promise<void> | null = null;

    constructor() {}

    async connect() {
        if (this.connectionPromise) {
            return this.connectionPromise;
        }

        this.connectionPromise = new Promise(async (resolve, reject) => {
            try {
                this.client = new MongoClient(process.env.MONGODB_URI);
                await this.client.connect();
                this.db = this.client.db(process.env.MONGODB_DB);
                this.logger.log('Connected to MongoDB');
                resolve();
            } catch (error) {
                this.logger.error('Error Connecting to MongoDB', error);
                reject(error);
            }
        });

        return this.connectionPromise;
    }

    async getDb(): Promise<Db> {
        if (!this.db) {
            await this.connect();
        }
        return this.db;
    }

    async onModuleDestroy() {
        if (this.client) {
            await this.client.close();
            this.logger.log('MongoDB connection closed');
        }
    }
}