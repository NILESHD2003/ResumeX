import { IsEmail, IsNotEmpty, IsString, isString } from 'class-validator';

export class emailValidateDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}

export class signupBodyDto {
    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    confirmPassword: string;

    @IsNotEmpty()
    @IsString()
    name: string
}

export class loginBodyDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
