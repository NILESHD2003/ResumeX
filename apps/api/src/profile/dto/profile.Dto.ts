import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsEnum,
  IsUrl,
  IsBoolean,
} from 'class-validator';
import { PlatformEnum } from './constant';
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

export class SocialLinkDto {
  @IsEnum(PlatformEnum)
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
  @Type(() => SocialLinkDto)
  socialLinks?: SocialLinkDto[];
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
  socialLinks?: SocialLinkDto[];
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
  startDate?: Date;

  @IsOptional()
  @IsDate()
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
  startDate?: Date;

  @IsOptional()
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  hide: boolean;
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