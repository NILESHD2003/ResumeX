import { ObjectId } from 'mongodb';

type platformType = 'LinkedIn' | 'GitHub' | 'Twitter' | 'Facebook' | 'Instagram' | 'YouTube' | 'Website' | 'Other';

export interface PersonalDetails {
  fullName?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  location?: string;
  personalInfo?: string;
  dateOfBirth?: Date;
  nationality?: string;
  passport_govt_id?: string;
  maritalStatus?: string;
  militaryService?: string;
  drivingLicense?: string;
  genderPronoun?: string;
  visa?: string;
  socialLinks?: Array<{
    platform: platformType;
    url: string;
  }>
}

export interface EducationDetail {
  _id: ObjectId;
  degree: string;
  school?: string;
  university?: string;
  link?: string;
  city?: string;
  country?: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  grade?: string;

  hide: boolean;
}

export interface ProfessionalExperience {
  _id: ObjectId;
  jobTitle: string;
  employer: string;
  link?: string;
  city?: string;
  country?: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;

  hide: boolean;
}

type skillLevelType = 'Beginner' | 'Amateur' | 'Competent' | 'Proficient' | 'Expert';

export interface Skill {
  _id: ObjectId;
  name: string;
  subSkills?: string[];
  level?: skillLevelType;

  hide: boolean;
}

type languageLevelType = 'Basic' | 'Conversational' | 'Proficient' | 'Fluent' | 'Native';

export interface Language {
  _id: ObjectId;
  name: string;
  additionalInfo?: string;
  level?: languageLevelType;

  hide: boolean;
}

export interface Certificate {
  _id: ObjectId;
  title: string;
  link?: string;
  additionalInfo?: string;
  issuer?: string;
  license?: string;
  date?: Date;
  expirationDate?: Date;

  hide: boolean;
}

type projectType = 'GitHub' | 'Website' | 'App Store' | 'Play Store' | 'Other';

export interface Project {
  _id: ObjectId;
  title: string;
  links?: Array<{
    type: projectType;
    url: string;
  }>;
  subtitle?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;

  hide: boolean;
}

export interface Award {
  _id: ObjectId;
  title: string;
  link?: string;
  issuer?: string;
  license?: string;
  date?: Date;
  expirationDate?: Date;

  hide: boolean;
}

export interface Course {
  _id: ObjectId;
  title: string;
  link?: string;
  additionalInfo?: string;
  issuer?: string;
  license?: string;
  date?: Date;
  expirationDate?: Date;

  hide: boolean;
}

export interface Organization {
  _id: ObjectId;
  name: string;
  link?: string;
  city?: string;
  country?: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;

  hide: boolean;
}

export interface Publication {
  _id: ObjectId;
  title: string;
  link?: string;
  publisher?: string;
  date?: Date;
  description?: string;
  citation?: string;

  hide: boolean;
}

export interface Reference {
  _id: ObjectId;
  name: string;
  link?: string;
  jobTitle?: string;
  organization?: string;
  email?: string;
  phone?: string;

  hide: boolean;
}

export interface Declaration {
  text?: string;
  signature?: string;
  fullName: string;
  place?: string;
  date?: Date;

  signaturePublicId?: string;

  hide: boolean;
}

export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  name: string;

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

export const USER_COLLECTION = 'users';