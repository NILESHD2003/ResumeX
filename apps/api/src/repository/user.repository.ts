import { Injectable } from '@nestjs/common';
import { Collection } from 'mongodb';
import { MongoService } from '../Mongo/mongo.service';
import { User, USER_COLLECTION } from '../Mongo/Schema/user.schema';

@Injectable()
export class UserRepository {
  private collection: Collection<User>;

  constructor(private readonly mongo: MongoService) {}

  async onModuleInit() {
    const db = await this.mongo.getDb();
    this.collection = db.collection<User>(USER_COLLECTION);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.collection.findOne({email});
  }

  async createNewUser(email: string, password: string, name: string): Promise<Boolean> {
    const user = await this.collection.insertOne({
      name,
      email,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return user.acknowledged;
  }
}