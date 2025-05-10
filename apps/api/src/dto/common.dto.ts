import { IsBoolean, IsOptional, IsString } from "class-validator";

export class SuccessResponseDto<T> {
  @IsBoolean()
  success: boolean;
  @IsString()
  message: string;
  @IsOptional()
  data?: T;
}