import { ObjectId } from 'mongodb';

interface personalDetails {
  fullName?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  location?: string;
  personalInfo?: string;
  dateOfBirth?: Date;
  nationality?: string;
  passport_govt_id?: string;
  martialStatus?: string;
  militaryService?: string;
  drivingLicense?: string;
  genderPronoun?: string;
  visa?: string;
  socialLinks?: [
    {
      platform: string;
      enum: [
        'LinkedIn',
        'GitHub',
        'Twitter',
        'Facebook',
        'Instagram',
        'YouTube',
        'Website',
        'Other'
      ];
      url: string;
    }
  ]
}

interface educationDetail {
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

interface professionalExperience {
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

interface skill {
  _id: ObjectId;
  name: string;
  subSkills?: [string];
  level?: {
    type: string;
    enum: ['Beginner', 'Amateur', 'Competent', 'Proficient', 'Expert'];
    default: 'Beginner';
  };

  hide: boolean;
}

interface language {
  _id: ObjectId;
  name: string;
  additionalInfo?: string;
  level?: {
    type: string;
    enum: ['Basic', 'Conversational', 'Proficient','Fluent', 'Native'];
    default: 'Basic';
  }

  hide: boolean;
}

interface certificate {
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

interface project {
  _id: ObjectId;
  title: string;
  links?: [
    {
      type: string;
      enum: ['GitHub', 'Website', 'App Store', 'Play Store', 'Other'];
      default: 'GitHub';
    }
  ],
  subtitle?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;

  hide: boolean;
}

interface award {
  _id: ObjectId;
  title: string;
  link?: string;
  issuer?: string;
  license?: string;
  date?: Date;
  expirationDate?: Date;

  hide: boolean;
}

interface course {
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

interface organization {
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

interface publication {
  _id: ObjectId;
  title: string;
  link?: string;
  publisher?: string;
  date?: Date;
  description?: string;
  citation?: string;

  hide: boolean;
}

interface reference {
  _id: ObjectId;
  name: string;
  link?: string;
  jobTitle?: string;
  organization?: string;
  email?: string;
  phone?: string;

  hide: boolean;
}

interface declaration{
  text: string;
  //TODO: later add signature image cdn url
  signature?: string;
  fullName: string;
  place?: string;
  date?: Date;

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

  personalDetails?: personalDetails;
  educationDetails?: [educationDetail];
  professionalExperience?: [professionalExperience];
  skills?: [skill];
  languages?: [language];
  certificates?: [certificate];
  projects?: [project];
  awards?: [award];
  courses?: [course];
  organizations?: [organization];
  publications?: [publication];
  references?: [reference];

  declaration?: declaration;

  createdAt?: Date;
  updatedAt?: Date;
}

export const USER_COLLECTION = 'users';