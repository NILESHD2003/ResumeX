import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/repository/user.repository';
import { PersonalDetailsDto, ProfileSummaryResponseDto } from './dto/profile.dto';
import { SuccessResponseDto } from 'src/dto/common.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly userRepository: UserRepository) {}

  async getProfile(email: string): Promise<SuccessResponseDto<any>> {
    const res = await this.userRepository.findUserByEmail(email);

    if (!res) {
      throw new HttpException(
        'Something Went Wrong while fetching Profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    //TODO: do filtration to remove unwanted fields
    const filteredData = res;
    delete filteredData.password;
    delete filteredData.createdAt;
    delete filteredData.updatedAt;
    delete filteredData._id;

    return {
      success: true,
      message: 'Profile Fetched Successfully',
      data: filteredData,
    };
  }

  async updateProfileSummary(email: string, summary: string): Promise<SuccessResponseDto<ProfileSummaryResponseDto>> {
    const res = await this.userRepository.updateUserProfileSummary(
      email,
      summary,
    );

    if (!res) {
      throw new HttpException(
        'Something went Wrong while Updating Profile Summary',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      success: true,
      message: 'Profile updated Succesfully',
      data: res,
    };
  }

  async getProfileSummary(email: string): Promise<SuccessResponseDto<ProfileSummaryResponseDto>> {
    const res = await this.userRepository.findUserByEmail(email);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while fetching Profile Summary',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      success: true,
      message: 'Fetched Profile Summary Succesfully',
      data: {
        summary: res.profileSummary || '',
        hide: res.hideProfileSummary || false,
      },
    };
  }

  async toggleSummaryVisibility(email: string): Promise<SuccessResponseDto<Boolean>> {
    const res = await this.userRepository.toggleProfileSummaryVisibility(email);
    
    if (res !== true && res !== false) {
      throw new HttpException(
        'Something went Wrong while toggling Profile Summary Visibility',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      success: true,
      message: 'Toggled Profile Summary Visibility Succesfully',
      data: res,
    };
  }

  async getPersonalDetails(email: string): Promise<SuccessResponseDto<PersonalDetailsDto>> {
    const res = await this.userRepository.findUserPersonalDetails(email);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while fetching Personal Details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      success: true,
      message: 'Fetched Personal Details Succesfully',
      data: res.personalDetails || {},
    };
  }

  async updatePersonalDetails(
    email: string,
    details: PersonalDetailsDto,
  ): Promise<SuccessResponseDto<PersonalDetailsDto>> {
    const res = await this.userRepository.updateUserPersonalDetails(
      email,
      details,
    );

    if (!res) {
      throw new HttpException(
        'Something went Wrong while updating Personal Details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      success: true,
      message: 'Updated Personal Details Succesfully',
      data: res.personalDetails || {},
    };
  }
}
