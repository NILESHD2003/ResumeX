import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export class EmailValidationDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ProfileSummaryRequestDto {
  @IsNotEmpty()
  @IsString()
  summary: string;
}

export enum PlatformEnum {
  LinkedIn = 'LinkedIn',
  GitHub = 'GitHub',
  Twitter = 'Twitter',
  Facebook = 'Facebook',
  Instagram = 'Instagram',
  YouTube = 'YouTube',
  Website = 'Website',
  Other = 'Other',
}

export class SocialLinkDto {
  @IsNotEmpty()
  @IsString()
  platform: string;

  @IsEnum(PlatformEnum)
  @IsNotEmpty()
  type: PlatformEnum;

  @IsNotEmpty()
  @IsString()
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
  @IsEmail()
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
