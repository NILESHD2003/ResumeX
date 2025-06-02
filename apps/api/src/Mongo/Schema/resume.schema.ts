import { ObjectId } from "mongodb";
import {PersonalDetails, EducationDetail, ProfessionalExperience, Skill, Language, Certificate, Project, Award, Course, Organization, Publication, Reference, Declaration} from './user.schema';

export interface Resume {
    _id?: ObjectId;
    userId: string;
    
    //Resume Data is stored here in JSON format
    profileSummary?: string;
    hideProfileSummary: boolean;

    profilePicture?: string;
    hideProfilePicture: boolean;

    personalDetails?: PersonalDetails;
    educationDetails?: EducationDetail[];
    professionalExperience?: ProfessionalExperience[];
    skills?: Skill[];
    languages?: Language[];
    certificates?: Certificate[];
    projects?: Project[];
    awards?: Award[];
    courses?: Course[];
    organizations?: Organization[];
    publications?: Publication[];
    references?: Reference[];

    declaration?: Declaration;

    createdAt?: Date;
    updatedAt?: Date;
}

export const RESUME_COLLECTION = 'resumes';