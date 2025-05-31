import { ObjectId } from "mongodb";

export interface Resume {
    _id?: ObjectId;
    userId: string;
    
    //Resume Data is stored here in JSON format
    

    createdAt?: Date;
    updatedAt?: Date;
}

export const RESUME_COLLECTION = 'resumes';