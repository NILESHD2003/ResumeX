import { ObjectId } from "mongodb";

export interface Invitation {
    _id?: ObjectId;
    email: string;
    inviteToken: string;
    createdAt?: Date;
    expiresAt?: Date;
}

export const INVITATION_COLLECTION = 'invitations';
