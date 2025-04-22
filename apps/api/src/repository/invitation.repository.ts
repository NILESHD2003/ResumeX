import { Injectable } from '@nestjs/common';
import { Collection } from 'mongodb';
import { MongoService } from '../Mongo/mongo.service';
import {
  Invitation,
  INVITATION_COLLECTION,
} from '../Mongo/Schema/invitation.schema';

@Injectable()
export class InvitationRepository {
  private collection: Collection<Invitation>;

  constructor(private readonly mongo: MongoService) {}

  async onModuleInit() {
    const db = await this.mongo.getDb();
    this.collection = db.collection<Invitation>(INVITATION_COLLECTION);

    await this.collection.createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0 },
    );
  }

  async findInvitationByToken(inviteToken: string): Promise<Invitation | null> {
    return await this.collection.findOne({ inviteToken });
  }

  async findInvitationByEmail(email: string): Promise<Invitation | null> {
    return await this.collection.findOne({ email });
  }

  async findAndDeleteInvitationByToken(inviteToken: string): Promise<Boolean | null> {
    const invitation = await this.collection.findOneAndDelete({
      inviteToken,
    });

    return invitation._id ? true : false;
  }

  async createInvitation(email: string, inviteToken: string): Promise<Invitation> {
    const invitation = await this.collection.insertOne({
      email,
      inviteToken,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 1 * 15 * 60 * 1000),
    });

    return invitation[0];
  }
}
