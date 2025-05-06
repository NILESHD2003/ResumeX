import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsEnum,
  IsUrl,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { PlatformEnum, SkillLevelEnum, LanguageLevelEnum, ProjectTypeEnum } from './constant';
import { Type, Expose } from 'class-transformer';
import { ObjectId } from 'mongodb';

export class ProfileSummaryRequestDto {
  @IsNotEmpty()
  @IsString()
  summary: string;
}

export class ProfileSummaryResponseDto {
  @IsString()
  summary: string;

  @IsBoolean()
  hide: boolean;
}

export class SocialLinkDto_Platform {
  @IsEnum(PlatformEnum)
  platform: string;
  @IsUrl()
  url: string;
}

export class SocialLinkDto_Project {
  @IsEnum(ProjectTypeEnum)
  platform: string;
  @IsUrl()
  url: string;
}

export class PersonalDetailsDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  personalInfo?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  passport_govt_id?: string;

  @IsOptional()
  @IsString()
  maritalStatus?: string;

  @IsOptional()
  @IsString()
  militaryService?: string;

  @IsOptional()
  @IsString()
  drivingLicense?: string;

  @IsOptional()
  @IsString()
  genderPronoun?: string;

  @IsOptional()
  @IsString()
  visa?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto_Platform)
  socialLinks?: SocialLinkDto_Platform[];
}

export class PersonalDetailsResponseDto {
  @Expose()
  fullName?: string;
  @Expose()
  jobTitle?: string;
  @Expose()
  email?: string;
  @Expose()
  phone?: string;
  @Expose()
  location?: string;
  @Expose()
  personalInfo?: string;
  @Expose()
  dateOfBirth?: Date;
  @Expose()
  nationality?: string;
  @Expose()
  passport_govt_id?: string;
  @Expose()
  maritalStatus?: string;
  @Expose()
  militaryService?: string;
  @Expose()
  drivingLicense?: string;
  @Expose()
  genderPronoun?: string;
  @Expose()
  visa?: string;
  @Expose()
  socialLinks?: SocialLinkDto_Platform[];
}

export class EducationDetailDto {
  @IsOptional()
  @IsString()
  _id?: ObjectId;

  @IsNotEmpty()
  @IsString()
  degree: string;

  @IsOptional()
  @IsString()
  school?: string;

  @IsOptional()
  @IsString()
  university?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsBoolean()
  hide: boolean;
}

export class EducationDetailUpdateDto {
  @IsOptional()
  @IsString()
  degree?: string;

  @IsOptional()
  @IsString()
  school?: string;

  @IsOptional()
  @IsString()
  university?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsOptional()
  @IsBoolean()
  hide?: boolean;
}

export class EducationDetailResponseDto {
  @Expose()
  _id: string;
  @Expose()
  degree: string;
  @Expose()
  school?: string;
  @Expose()
  university?: string;
  @Expose()
  link?: string;
  @Expose()
  city?: string;
  @Expose()
  country?: string;
  @Expose()
  startDate?: Date;
  @Expose()
  endDate?: Date;
  @Expose()
  description?: string;
  @Expose()
  grade?: string;
  @Expose()
  hide: boolean;
}

export class ProfessionalExperienceDto {
  @IsOptional()
  @IsString()
  _id?: ObjectId;

  @IsNotEmpty()
  @IsString()
  jobTitle: string;

  @IsOptional()
  @IsString()
  employer?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  hide: boolean;
}

export class ProfessionalExperienceUpdateDto {
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  employer?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  hide?: boolean;
}

export class ProfessionalExperienceResponseDto {
  @Expose()
  _id: string;
  @Expose()
  jobTitle: string;
  @Expose()
  employer?: string;
  @Expose()
  link?: string;
  @Expose()
  city?: string;
  @Expose()
  country?: string;
  @Expose()
  startDate?: Date;
  @Expose()
  endDate?: Date;
  @Expose()
  description?: string;
  @Expose()
  hide: boolean;
}

export class SkillDto {
  @IsOptional()
  @IsString()
  _id?: ObjectId;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  subSkills?: string[];

  @IsOptional()
  @IsEnum(SkillLevelEnum)
  level?: SkillLevelEnum;

  @IsBoolean()
  hide: boolean;
}

export class SkillUpdateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  subSkills?: string[];

  @IsOptional()
  @IsEnum(SkillLevelEnum)
  level?: SkillLevelEnum;

  @IsOptional()
  @IsBoolean()
  hide?: boolean;
}

export class SkillResponseDto {
  @Expose()
  _id: string;
  @Expose()
  name: string;
  @Expose()
  subSkills?: string[];
  @Expose()
  level?: SkillLevelEnum;
  @Expose()
  hide: boolean;
}

export class LanguageDto {
  @IsOptional()
  @IsString()
  _id?: ObjectId;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  additionalInfo?: string;

  @IsOptional()
  @IsEnum(LanguageLevelEnum)
  level?: LanguageLevelEnum;

  @IsBoolean()
  hide: boolean;
}

export class LanguageUpdateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  additionalInfo?: string;

  @IsOptional()
  @IsEnum(LanguageLevelEnum)
  level?: LanguageLevelEnum;

  @IsBoolean()
  @IsOptional()
  hide?: boolean;
}

export class LanguageResponseDto {
  @Expose()
  _id: string;
  @Expose()
  name: string;
  @Expose()
  additionalInfo?: string;
  @Expose()
  level?: LanguageLevelEnum;
  @Expose()
  hide: boolean;
}

export class CertificateDto {
  @IsOptional()
  @IsString()
  _id?: ObjectId; 

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  additionalInfo?: string;

  @IsOptional()
  @IsString()
  issuer?: string;

  @IsOptional()
  @IsString()
  license?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expirationDate?: Date;

  @IsBoolean()
  hide: boolean;
}

export class CertificateUpdateDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  additionalInfo?: string;

  @IsOptional()
  @IsString()
  issuer?: string;

  @IsOptional()
  @IsString()
  license?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expirationDate?: Date;

  @IsOptional()
  @IsBoolean()
  hide?: boolean;
} 

export class CertificateResponseDto {
  @Expose()
  _id: string;
  @Expose()
  title: string;
  @Expose()
  link?: string;
  @Expose()
  additionalInfo?: string;
  @Expose()
  issuer?: string;
  @Expose()
  license?: string;
  @Expose()
  date?: Date;
  @Expose()
  expirationDate?: Date;
  @Expose()
  hide: boolean;
}

export class ProjectDto {
  @IsOptional()
  @IsString()
  _id?: ObjectId;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto_Project)
  links?: SocialLinkDto_Project[];

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsBoolean()
  hide: boolean;
}

export class ProjectUpdateDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto_Project)
  links?: SocialLinkDto_Project[];

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsBoolean()
  hide?: boolean;
}

export class ProjectResponseDto {
  @Expose()
  _id: string;
  @Expose()
  title: string;
  @Expose()
  links?: SocialLinkDto_Project[];
  @Expose()
  subtitle?: string;
  @Expose()
  description?: string;
  @Expose()
  startDate?: Date;
  @Expose()
  endDate?: Date;
  @Expose()
  hide: boolean;
}

export class AwardDto {
  @IsOptional()
  @IsString()
  _id?: ObjectId;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  additionalInfo?: string;

  @IsOptional()
  @IsString()
  issuer?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @IsBoolean()
  hide: boolean;
}

export class AwardUpdateDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  additionalInfo?: string;

  @IsOptional()
  @IsString()
  issuer?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;


  @IsOptional()
  @IsBoolean()
  hide?: boolean;
}

export class AwardResponseDto {
  @Expose()
  _id: string;
  @Expose()
  title: string;
  @Expose()
  link?: string;
  @Expose()
  additionalInfo?: string;
  @Expose()
  issuer?: string;
  @Expose()
  date?: Date;
  @Expose()
  hide: boolean;
}

export class CourseDto {
  @IsOptional()
  @IsString()
  _id?: ObjectId;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  additionalInfo?: string;
  
  @IsOptional()
  @IsString()
  issuer?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expirationDate?: Date;

  @IsBoolean()
  hide: boolean;
}

export class CourseUpdateDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  additionalInfo?: string;
  
  @IsOptional()
  @IsString()
  issuer?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expirationDate?: Date;

  @IsOptional()
  @IsBoolean()
  hide?: boolean;
}

export class CourseResponseDto {
  @Expose()
  _id: string;
  @Expose()
  title: string;
  @Expose()
  link?: string;
  @Expose()
  additionalInfo?: string;
  @Expose()
  issuer?: string;
  @Expose()
  date?: Date;
  @Expose()
  expirationDate?: Date;
  @Expose()
  hide: boolean;
}

export class OrganizationDto {
  @IsOptional()
  @IsString()
  _id?: ObjectId;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;
  
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  hide: boolean;
}

export class OrganizationUpdateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;
  
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  hide?: boolean;
}

export class OrganizationResponseDto {
  @Expose()
  _id: string;
  @Expose()
  name: string;
  @Expose()
  link?: string;
  @Expose()
  city?: string;
  @Expose()
  country?: string;
  @Expose()
  startDate?: Date;
  @Expose()
  endDate?: Date;
  @Expose()
  description?: string;
  @Expose()
  hide: boolean;
}

export class PublicationDto {
  @IsOptional()
  @IsString()
  _id?: ObjectId;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  citation?: string;

  @IsBoolean()
  hide: boolean;
}

export class PublicationUpdateDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  citation?: string;

  @IsOptional()
  @IsBoolean()
  hide?: boolean;
}

export class PublicationResponseDto {
  @Expose()
  _id: string;
  @Expose()
  title: string;
  @Expose()
  link?: string;
  @Expose()
  publisher?: string;
  @Expose()
  date?: Date;
  @Expose()
  description?: string;
  @Expose()
  citation?: string;
  @Expose()
  hide: boolean;
} 

export class ReferenceDto {
  @IsOptional()
  @IsString()
  _id?: ObjectId;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  organization?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsBoolean()
  hide: boolean;
}

export class ReferenceUpdateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  organization?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  hide?: boolean;
}

export class ReferenceResponseDto {
  @Expose()
  _id: string;
  @Expose()
  name: string;
  @Expose()
  link?: string;
  @Expose()
  jobTitle?: string;
  @Expose()
  organization?: string;
  @Expose()
  email?: string;
  @Expose()
  phone?: string;
  @Expose()
  hide: boolean;
}

export class DeclarationDto {
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  signature?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  place?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @IsBoolean()
  @IsOptional()
  hide: boolean;
}

export class DeclarationResponseDto {
  @Expose()
  text?: string;
  @Expose()
  signature?: string;
  @Expose()
  fullName?: string;
  @Expose()
  place?: string;
  @Expose()
  date?: Date;
  @Expose()
  hide: boolean;
}
