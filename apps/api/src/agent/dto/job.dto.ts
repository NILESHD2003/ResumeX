import { IsNotEmpty, IsString } from 'class-validator';

export class NewJobDto {
  @IsNotEmpty()
  @IsString()
  jobDescription: string;
}

//TODO: Complete this response
export class NewJobDtoResponse {}
