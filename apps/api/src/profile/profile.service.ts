import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/repository/user.repository';
import {
  PersonalDetailsDto,
  ProfileSummaryResponseDto,
  PersonalDetailsResponseDto,
  EducationDetailResponseDto,
  EducationDetailDto,
  ProfessionalExperienceResponseDto,
  ProfessionalExperienceDto,
} from './dto/profile.dto';
import { SuccessResponseDto } from 'src/dto/common.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ObjectId } from 'mongodb';

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

  async updateProfileSummary(
    email: string,
    summary: string,
  ): Promise<SuccessResponseDto<ProfileSummaryResponseDto>> {
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

  async getProfileSummary(
    email: string,
  ): Promise<SuccessResponseDto<ProfileSummaryResponseDto>> {
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

  async toggleSummaryVisibility(
    email: string,
  ): Promise<SuccessResponseDto<Boolean>> {
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

  async getPersonalDetails(
    email: string,
  ): Promise<SuccessResponseDto<PersonalDetailsResponseDto>> {
    const res = await this.userRepository.findUserPersonalDetails(email);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while fetching Personal Details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const data = plainToInstance(
      PersonalDetailsResponseDto,
      res.personalDetails,
      {
        excludeExtraneousValues: true,
      },
    );

    return {
      success: true,
      message: 'Fetched Personal Details Succesfully',
      data: (instanceToPlain(data) as PersonalDetailsResponseDto) || null,
    };
  }

  async updatePersonalDetails(
    email: string,
    details: PersonalDetailsDto,
  ): Promise<SuccessResponseDto<PersonalDetailsResponseDto>> {
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

    const data = plainToInstance(
      PersonalDetailsResponseDto,
      res.personalDetails,
      {
        excludeExtraneousValues: true,
      },
    );

    return {
      success: true,
      message: 'Updated Personal Details Succesfully',
      data: (instanceToPlain(data) as PersonalDetailsResponseDto) || null,
    };
  }
}

@Injectable()
export class Education_ProfileService {
  constructor(private readonly userRepository: UserRepository) {}

  async getEducationDetails(
    email: string,
  ): Promise<SuccessResponseDto<EducationDetailResponseDto[]>> {
    const res = await this.userRepository.findUserByEmail(email);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while fetching Education Details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const preparedDetails = res.educationDetails.map((detail) => {
      return {
        ...detail,
        _id: detail._id.toString(),
      };
    });

    const data = plainToInstance(EducationDetailResponseDto, preparedDetails, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Fetched Education Details Succesfully',
      data: (instanceToPlain(data) as EducationDetailResponseDto[]) || [],
    };
  }

  async addEducationDetail(
    email: string,
    details: EducationDetailDto,
  ): Promise<SuccessResponseDto<EducationDetailResponseDto>> {
    details._id = new ObjectId();
    const res = await this.userRepository.addEducationDetail(email, details);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while adding Education Detail',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const addedDetail = res.educationDetails[res.educationDetails.length - 1];

    const preparedDetail = {
      ...addedDetail,
      _id: addedDetail._id.toString(),
    };

    const data = plainToInstance(EducationDetailResponseDto, preparedDetail, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Added Education Detail Succesfully',
      data: (instanceToPlain(data) as EducationDetailResponseDto) || null,
    };
  }

  async updateEducationDetail(
    email: string,
    details: any,
    recordId: string,
  ): Promise<SuccessResponseDto<EducationDetailResponseDto>> {
    const res = await this.userRepository.updateEducationDetail(
      email,
      details,
      recordId,
    );

    if (!res) {
      throw new HttpException(
        'No Education Detail found with the given ID',
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedDetail = res.educationDetails.find(
      (detail) => detail._id.toString() === recordId,
    );

    if (!updatedDetail) {
      throw new HttpException(
        'Education Detail not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const preparedDetail = {
      ...updatedDetail,
      _id: updatedDetail._id.toString(),
    };

    const data = plainToInstance(EducationDetailResponseDto, preparedDetail, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Updated Education Detail Succesfully',
      data: (instanceToPlain(data) as EducationDetailResponseDto) || null,
    };
  }

  async toggleEducationDetailVisibility(
    email: string,
    recordId: string,
  ): Promise<SuccessResponseDto<Boolean>> {
    const res = await this.userRepository.toggleEducationDetailVisibility(
      email,
      recordId,
    );

    if (res !== true && res !== false) {
      throw new HttpException(
        'Something went Wrong while toggling Education Detail Visibility',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      success: true,
      message: 'Toggled Education Detail Visibility Succesfully',
      data: res,
    };
  }

  async deleteEducationDetail(
    email: string,
    recordId: string,
  ): Promise<SuccessResponseDto<EducationDetailResponseDto[]>> {
    const res = await this.userRepository.deleteEducationDetail(
      email,
      recordId,
    );

    if (!res) {
      throw new HttpException(
        'No Education Detail found with the given ID',
        HttpStatus.NOT_FOUND,
      );
    }

    const preparedDetails = res.educationDetails.map((detail) => {
      return {
        ...detail,
        _id: detail._id.toString(),
      };
    });

    const data = plainToInstance(EducationDetailResponseDto, preparedDetails, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Deleted Education Detail Succesfully',
      data: (instanceToPlain(data) as EducationDetailResponseDto[]) || [],
    };
  }
}

@Injectable()
export class Professional_ProfileService {
  constructor(private readonly userRepository: UserRepository) {}

  async getProfessionalDetails(
    email: string,
  ): Promise<SuccessResponseDto<ProfessionalExperienceResponseDto[]>> {
    const res = await this.userRepository.findUserByEmail(email);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while fetching Professional Details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    let preparedDetails;
    let data;

    if(res.professionalExperience && res.professionalExperience.length > 0) {
      preparedDetails = res.professionalExperience.map((detail) => {
        return {
          ...detail,
          _id: detail._id.toString(),
        };
      });
  
      data = plainToInstance(ProfessionalExperienceResponseDto, preparedDetails, {
        excludeExtraneousValues: true,
      });
    } else {
      data = [];
    }

    return {
      success: true,
      message: 'Fetched Professional Details Succesfully',
      data: data,
    };
  }

  async addProfessionalExperience(
    email: string,
    details: ProfessionalExperienceDto,
  ): Promise<SuccessResponseDto<ProfessionalExperienceResponseDto>> {
    details._id = new ObjectId();
    const res = await this.userRepository.addProfessionalExperience(
      email,
      details,
    );

    if (!res) {
      throw new HttpException(
        'Something went Wrong while adding Professional Experience',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const addedDetail = res.professionalExperience[
      res.professionalExperience.length - 1
    ];

    const preparedDetail = {
      ...addedDetail,
      _id: addedDetail._id.toString(),
    };

    const data = plainToInstance(ProfessionalExperienceResponseDto, preparedDetail, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Added Professional Experience Succesfully',
      data: (instanceToPlain(data) as ProfessionalExperienceResponseDto) || null,
    };
  }

  async updateProfessionalExperience(
    email: string,
    details: any,
    recordId: string,
  ): Promise<SuccessResponseDto<ProfessionalExperienceResponseDto>> {
    const res = await this.userRepository.updateProfessionalExperience(
      email,
      details,
      recordId,
    );

    if (!res) {
      throw new HttpException(
        'No Professional Experience found with the given ID',
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedDetail = res.professionalExperience.find(
      (detail) => detail._id.toString() === recordId,
    );

    if (!updatedDetail) {
      throw new HttpException(
        'Professional Experience not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const preparedDetail = {
      ...updatedDetail,
      _id: updatedDetail._id.toString(),
    };

    const data = plainToInstance(ProfessionalExperienceResponseDto, preparedDetail, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Updated Professional Experience Succesfully',
      data: (instanceToPlain(data) as ProfessionalExperienceResponseDto) || null,
    };
  }

  async toggleProfessionalExperienceVisibility(
    email: string,
    recordId: string,
  ): Promise<SuccessResponseDto<Boolean>> {
    const res = await this.userRepository.toggleProfessionalExperienceVisibility(
      email,
      recordId,
    );

    if (res !== true && res !== false) {
      throw new HttpException(
        'Something went Wrong while toggling Professional Experience Visibility',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      success: true,
      message: 'Toggled Professional Experience Visibility Succesfully',
      data: res,
    };
  }

  async deleteProfessionalExperience(
    email: string,
    recordId: string,
  ): Promise<SuccessResponseDto<ProfessionalExperienceResponseDto[]>> {
    const res = await this.userRepository.deleteProfessionalExperience(
      email,
      recordId,
    );

    if (!res) {
      throw new HttpException(
        'No Professional Experience found with the given ID',
        HttpStatus.NOT_FOUND,
      );
    }

    const preparedDetails = res.professionalExperience.map((detail) => {
      return {
        ...detail,
        _id: detail._id.toString(),
      };
    });

    const data = plainToInstance(ProfessionalExperienceResponseDto, preparedDetails, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Deleted Professional Experience Succesfully',
      data: (instanceToPlain(data) as ProfessionalExperienceResponseDto[]) || [],
    };
  }
}
