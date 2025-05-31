import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class NewJobDto {
  @IsOptional()
  @IsString()
  jobDescription?: string;

  @IsOptional()
  @IsString()
  jobLink?: string;
}

//TODO: Complete this response
export class NewJobDtoResponse {}
