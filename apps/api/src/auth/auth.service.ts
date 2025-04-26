import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { generate } from 'generate-password';
import { hash, compare } from 'bcrypt';
import { UserRepository } from '../repository/user.repository';
import { InvitationRepository } from '../repository/invitation.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly inviteRepository: InvitationRepository,
    private readonly jwtService: JwtService
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{
    success: boolean;
    message: string;
    token?: string;
  }> {
    const emailExist = await this.userRepository.findUserByEmail(email);

    if (!emailExist) {
      throw new HttpException('Email Not Found.', 404);
    }

    if (await compare(password, emailExist.password)) {
      
      const payload = {
        id: emailExist._id,
        email: emailExist.email,
        name: emailExist.name
      };
      const token = await this.jwtService.signAsync(payload);

      return {
        success: true,
        message: 'Sign In Success.',
        token
      };
    } else {
      throw new HttpException('Password Incorrect.', 401);
    }
  }

  async signup(
    inviteToken: string,
    password: string,
    confirmPassword: string,
    name: string,
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    if (password !== confirmPassword) {
      throw new HttpException('Password Mismatch.', 401);
    }
    const token =
      await this.inviteRepository.findInvitationByToken(inviteToken);

    if (!token) {
      throw new HttpException('Invalid Token.', 401);
    }

    const hasedPassword = await hash(password, 10);

    const emailExist = await this.userRepository.findUserByEmail(token.email);

    if (emailExist) {
      throw new HttpException('Email Already Exist.', 401);
    }

    await this.userRepository.createNewUser(token.email, hasedPassword, name);

    await this.inviteRepository.findAndDeleteInvitationByToken(inviteToken);

    return {
      success: true,
      message: 'Signup Success. Continue Logging In.',
    };
  }

  async sendMagicLink(email: string): Promise<{
    success: boolean;
    data: string | null;
    message: string;
  }> {
    const isInvited = await this.inviteRepository.findInvitationByEmail(email);

    const user = await this.userRepository.findUserByEmail(email);

    if (user) {
      throw new HttpException('User Already Exist.', 401);
    }

    if (isInvited && isInvited.expiresAt > new Date()) {
      throw new HttpException(
        'Already invited. Resending invitation mail.',
        409)
    }

    let inviteToken: string;
    let existingToken: any;

    do {
      inviteToken = generate({
        length: 12,
        symbols: false,
        numbers: true,
        uppercase: false,
        lowercase: true,
      });

      existingToken =
        await this.inviteRepository.findInvitationByToken(inviteToken);
    } while (existingToken);

    await this.inviteRepository.createInvitation(email, inviteToken);

    return {
      success: true,
      data: inviteToken,
      message: 'Invitation Token Sent.',
    };
  }
}
