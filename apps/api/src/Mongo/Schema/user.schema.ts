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

interface educationDetails {
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
}

interface professionalExperience {
  jobTitle: string;
  employer: string;
  link?: string;
  city?: string;
  country?: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
}

interface skills {
  name: string;
  subSkills?: [string];
  level?: {
    type: string;
    enum: ['Beginner', 'Amateur', 'Competent', 'Proficient', 'Expert'];
    default: 'Beginner';
  }
}

interface language {
  name: string;
  additionalInfo?: string;
  level?: {
    type: string;
    enum: ['Basic', 'Conversational', 'Proficient','Fluent', 'Native'];
    default: 'Basic';
  }
}

interface certificate {
  title: string;
  link?: string;
  additionalInfo?: string;
  issuer?: string;
  license?: string;
  date?: Date;
  expirationDate?: Date;
}

interface project {
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
}

interface award {
  title: string;
  link?: string;
  issuer?: string;
  license?: string;
  date?: Date;
  expirationDate?: Date;
}

interface course {
  title: string;
  link?: string;
  additionalInfo?: string;
  issuer?: string;
  license?: string;
  date?: Date;
  expirationDate?: Date;
}

interface organization {
  name: string;
  link?: string;
  city?: string;
  country?: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
}

interface publication {
  title: string;
  link?: string;
  publisher?: string;
  date?: Date;
  description?: string;
  citation?: string;
}

interface reference {
  name: string;
  link?: string;
  jobTitle?: string;
  organization?: string;
  email?: string;
  phone?: string;
}

interface declaration{
  text: string;
  //TODO: later add signature image cdn url
  signature?: string;
  fullName: string;
  place?: string;
  date?: Date;
}

export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  name: string;

  personalDetails?: personalDetails;
  educationDetails?: [educationDetails];
  professionalExperience?: [professionalExperience];
  skills?: [skills];
  profileSummary?: string;
  profilePicture?: string;
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