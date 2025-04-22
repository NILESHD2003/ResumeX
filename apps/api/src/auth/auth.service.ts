import { Injectable } from '@nestjs/common';
import { generate } from 'generate-password';
import {hash, compare} from 'bcrypt';
import { UserRepository } from '../repository/user.repository';
import { InvitationRepository } from '../repository/invitation.repository';

@Injectable()
export class AuthService {
  constructor( private readonly userRepository: UserRepository, private readonly inviteRepository: InvitationRepository) {}

  async login(email: string, password: string): Promise<{
    success: boolean,
    message: string
  }> {
    try {
      const emailExist = await this.userRepository.findUserByEmail(email);

      if(!emailExist) {
        return {
          success: false,
          message: "Email Not Registered."
        }
      }

      if(await compare(password, emailExist.password)) {
        //TODO: sign and send jwt token.

        return {
          success: true,
          message: "Sign In Success."
        }
      }else{
        return {
          success: false,
          message: "Password is Incorrect."
        }
      }
    } catch (error) {
      console.error("Something Went Wrong while Logging In.", error);
      return {
        success: false,
        message: "Something Went Wrong while Logging In.Try Again Later."
      }
    }
  }

  async signup(inviteToken: string, password: string, confirmPassword: string, name: string): Promise<{
    success: boolean,
    message: string
  }> {
    try {
      console.log(inviteToken, password, confirmPassword, name)
        if (password !== confirmPassword) {
          return {
            success: false,
            message: "Password and Confirm Password Do not match."
          }
        }
        const token = await this.inviteRepository.findInvitationByToken(inviteToken);

        if(!token) {
          return {
            success: false,
            message: "Invitation Token Not Found."
          }
        }

        const hasedPassword = await hash(password, 10);

        const emailExist = await this.userRepository.findUserByEmail(token.email);

        if(emailExist) {
          return {
            success: false,
            message: "Email Already Registered. Try Signing In."
          }
        }

        await this.userRepository.createNewUser(token.email, hasedPassword, name);

        await this.inviteRepository.findAndDeleteInvitationByToken(inviteToken);

        return {
          success: true,
          message: "Signup Success. Continue Logging In."
        }
    } catch (error) {
        console.error('Error Signing Up', error);
        return {
            success: false,
            message: "Something went wrong while Signing Up User."
        }
    }
  }

  async sendMagicLink(email: string): Promise<{
    success: boolean;
    data: string | null;
    message: string;
  }> {
    try {
      const isInvited = await this.inviteRepository.findInvitationByEmail(email);

      if (isInvited && isInvited.expiresAt > new Date()) {
        return {
          success: true,
          data: isInvited.inviteToken,
          message: 'Already invited. Resending invitation mail.',
        };
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

        existingToken = await this.inviteRepository.findInvitationByToken(inviteToken);

      } while (existingToken);

      await this.inviteRepository.createInvitation(email, inviteToken);

      return {
        success: true,
        data: inviteToken,
        message: 'Invitation Token Sent.',
      };
    } catch (error) {
      console.error('Error generating invitation token:', error);
      return {
        success: false,
        data: null,
        message: 'Something went wrong while generating the invitation token.',
      };
    }
  }
}
