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
import { Type } from 'class-transformer';

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
  martialStatus?: string;

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