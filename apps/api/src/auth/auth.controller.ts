import { Body, Controller, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { emailValidateDto, loginBodyDto, signupBodyDto } from './dto/user.Dto';

@Controller('auth')
export class AuthController {
    constructor (private readonly authService: AuthService) {}

    @Post('login')
    login(@Body() body: loginBodyDto): Promise<{
        success: boolean,
        message: string,
        token?: string
    }> {
        return this.authService.login(body.email, body.password);
    }

    @Post('signup/:inviteToken')
    signup(@Body() body: signupBodyDto, @Param('inviteToken') inviteToken: string): Promise<{
        success: boolean,
        message: string
    }> {
        return this.authService.signup( inviteToken, body.password, body.confirmPassword, body.name);
    }

    @Post('send-magic-link')
    sendMagicLink(@Body() body: emailValidateDto): Promise<{
        success: boolean,
        data: string,
        message: string
    }> {
        return this.authService.sendMagicLink(body.email);
    }
}
