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
  SkillResponseDto,
  SkillDto,
  LanguageResponseDto,
  LanguageDto,
  CertificateResponseDto,
  CertificateDto,
  ProjectDto,
  ProjectResponseDto,
  AwardResponseDto,
  AwardDto,
  CourseResponseDto,
  CourseDto,
  OrganizationResponseDto,
  OrganizationDto,
  PublicationResponseDto,
  PublicationDto,
  ReferenceResponseDto,
  ReferenceDto,
  DeclarationResponseDto,
  DeclarationDto,
} from './dto/profile';
import { SuccessResponseDto } from 'src/dto/common.dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

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

    if (filteredData.declaration) {
      delete filteredData.declaration.signaturePublicId;
    }

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

  async getProfileImage(email: string): Promise<SuccessResponseDto<string>> {
    const res = await this.userRepository.findUserByEmail(email);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while fetching Profile Image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      success: true,
      message: 'Fetched Profile Image Succesfully',
      data: res.profilePicture || null,
    };
  }

  async updateProfileImage(
    email: string,
    image: Express.Multer.File,
  ): Promise<SuccessResponseDto<string>> {
    const uploadedImage = await this.cloudinaryService.uploadImage(image);

    const res = await this.userRepository.updateProfileImage(
      email,
      uploadedImage.url,
      uploadedImage.publicId,
    );

    if (!res) {
      throw new HttpException(
        'Something went Wrong while updating Profile Image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      success: true,
      message: 'Updated Profile Image Succesfully',
      data: uploadedImage.url,
    };
  }

  async toggleProfileImageVisibility(
    email: string,
  ): Promise<SuccessResponseDto<Boolean>> {
    const res = await this.userRepository.toggleProfileImageVisibility(email);

    if (res !== true && res !== false) {
      throw new HttpException(
        'Something went Wrong while toggling Profile Image Visibility',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      success: true,
      message: 'Toggled Profile Image Visibility Succesfully',
      data: res,
    };
  }

  async removeProfileImage(email: string): Promise<SuccessResponseDto<string>> {
    const res = await this.userRepository.removeProfileImage(email);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while removing Profile Image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      success: true,
      message: 'Removed Profile Image Succesfully',
      data: null,
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

    let data;
    if (res.educationDetails && res.educationDetails.length > 0) {
      const preparedDetails = res.educationDetails.map((detail) => {
        return {
          ...detail,
          _id: detail._id.toString(),
        };
      });

      data = plainToInstance(EducationDetailResponseDto, preparedDetails, {
        excludeExtraneousValues: true,
      });
    } else {
      data = [];
    }

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

    if (res.professionalExperience && res.professionalExperience.length > 0) {
      preparedDetails = res.professionalExperience.map((detail) => {
        return {
          ...detail,
          _id: detail._id.toString(),
        };
      });

      data = plainToInstance(
        ProfessionalExperienceResponseDto,
        preparedDetails,
        {
          excludeExtraneousValues: true,
        },
      );
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

    const addedDetail =
      res.professionalExperience[res.professionalExperience.length - 1];

    const preparedDetail = {
      ...addedDetail,
      _id: addedDetail._id.toString(),
    };

    const data = plainToInstance(
      ProfessionalExperienceResponseDto,
      preparedDetail,
      {
        excludeExtraneousValues: true,
      },
    );

    return {
      success: true,
      message: 'Added Professional Experience Succesfully',
      data:
        (instanceToPlain(data) as ProfessionalExperienceResponseDto) || null,
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

    const data = plainToInstance(
      ProfessionalExperienceResponseDto,
      preparedDetail,
      {
        excludeExtraneousValues: true,
      },
    );

    return {
      success: true,
      message: 'Updated Professional Experience Succesfully',
      data:
        (instanceToPlain(data) as ProfessionalExperienceResponseDto) || null,
    };
  }

  async toggleProfessionalExperienceVisibility(
    email: string,
    recordId: string,
  ): Promise<SuccessResponseDto<Boolean>> {
    const res =
      await this.userRepository.toggleProfessionalExperienceVisibility(
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

    const data = plainToInstance(
      ProfessionalExperienceResponseDto,
      preparedDetails,
      {
        excludeExtraneousValues: true,
      },
    );

    return {
      success: true,
      message: 'Deleted Professional Experience Succesfully',
      data:
        (instanceToPlain(data) as ProfessionalExperienceResponseDto[]) || [],
    };
  }
}

@Injectable()
export class Skill_ProfileService {
  constructor(private readonly userRepository: UserRepository) {}

  async getSkills(
    email: string,
  ): Promise<SuccessResponseDto<SkillResponseDto[]>> {
    const res = await this.userRepository.findUserByEmail(email);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while fetching Skills',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    let preparedDetails;
    let data;

    if (res.skills && res.skills.length > 0) {
      preparedDetails = res.skills.map((detail) => {
        return {
          ...detail,
          _id: detail._id?.toString(),
        };
      });

      data = plainToInstance(SkillResponseDto, preparedDetails, {
        excludeExtraneousValues: true,
      });
    } else {
      data = [];
    }

    return {
      success: true,
      message: 'Fetched Skills Succesfully',
      data: data,
    };
  }

  async addSkill(
    email: string,
    details: SkillDto,
  ): Promise<SuccessResponseDto<SkillResponseDto>> {
    details._id = new ObjectId();
    const res = await this.userRepository.addSkill(email, details);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while adding Skill',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const addedDetail = res.skills[res.skills.length - 1];

    const preparedDetail = {
      ...addedDetail,
      _id: addedDetail._id.toString(),
    };

    const data = plainToInstance(SkillResponseDto, preparedDetail, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Added Skill Succesfully',
      data: (instanceToPlain(data) as SkillResponseDto) || null,
    };
  }

  async updateSkill(
    email: string,
    recordId: string,
    details: any,
  ): Promise<SuccessResponseDto<SkillResponseDto>> {
    const res = await this.userRepository.updateSkill(email, recordId, details);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while updating Skill',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const updatedDetail = res.skills.find(
      (detail) => detail._id.toString() === recordId,
    );

    if (!updatedDetail) {
      throw new HttpException('Skill not found', HttpStatus.NOT_FOUND);
    }

    const preparedDetail = {
      ...updatedDetail,
      _id: updatedDetail._id.toString(),
    };

    const data = plainToInstance(SkillResponseDto, preparedDetail, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Updated Skill Succesfully',
      data: (instanceToPlain(data) as SkillResponseDto) || null,
    };
  }

  async toggleSkillVisibility(
    email: string,
    recordId: string,
  ): Promise<SuccessResponseDto<Boolean>> {
    const res = await this.userRepository.toggleSkillVisibility(
      email,
      recordId,
    );

    if (res !== true && res !== false) {
      throw new HttpException(
        'Something went Wrong while toggling Skill Visibility',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      success: true,
      message: 'Toggled Skill Visibility Succesfully',
      data: res,
    };
  }

  async deleteSkill(
    email: string,
    recordId: string,
  ): Promise<SuccessResponseDto<SkillResponseDto[]>> {
    const res = await this.userRepository.deleteSkill(email, recordId);

    if (!res) {
      throw new HttpException(
        'No Skill found with the given ID',
        HttpStatus.NOT_FOUND,
      );
    }

    const preparedDetails = res.skills.map((detail) => {
      return {
        ...detail,
        _id: detail._id.toString(),
      };
    });

    const data = plainToInstance(SkillResponseDto, preparedDetails, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Deleted Skill Succesfully',
      data: (instanceToPlain(data) as SkillResponseDto[]) || [],
    };
  }
}

@Injectable()
export class Language_ProfileService {
  constructor(private readonly userRepository: UserRepository) {}

  async getLanguages(
    email: string,
  ): Promise<SuccessResponseDto<LanguageResponseDto[]>> {
    const res = await this.userRepository.findUserByEmail(email);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while fetching Languages',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    let preparedDetails;
    let data;

    if (res.languages && res.languages.length > 0) {
      preparedDetails = res.languages.map((detail) => {
        return {
          ...detail,
          _id: detail._id.toString(),
        };
      });

      data = plainToInstance(LanguageResponseDto, preparedDetails, {
        excludeExtraneousValues: true,
      });

      data = (instanceToPlain(data) as LanguageResponseDto[]) || [];
    } else {
      data = [];
    }

    return {
      success: true,
      message: 'Fetched Languages Succesfully',
      data: data,
    };
  }

  async addLanguage(
    email: string,
    details: LanguageDto,
  ): Promise<SuccessResponseDto<LanguageResponseDto>> {
    details._id = new ObjectId();
    const res = await this.userRepository.addLanguage(email, details);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while adding Language',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const addedDetail = res.languages[res.languages.length - 1];

    const preparedDetail = {
      ...addedDetail,
      _id: addedDetail._id.toString(),
    };

    const data = plainToInstance(LanguageResponseDto, preparedDetail, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Added Language Succesfully',
      data: (instanceToPlain(data) as LanguageResponseDto) || null,
    };
  }

  async updateLanguage(
    email: string,
    recordId: string,
    details: any,
  ): Promise<SuccessResponseDto<LanguageResponseDto>> {
    const res = await this.userRepository.updateLanguage(
      email,
      recordId,
      details,
    );

    if (!res) {
      throw new HttpException(
        'Something went Wrong while updating Language',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const updatedDetail = res.languages.find(
      (detail) => detail._id.toString() === recordId,
    );

    if (!updatedDetail) {
      throw new HttpException('Language not found', HttpStatus.NOT_FOUND);
    }

    const preparedDetail = {
      ...updatedDetail,
      _id: updatedDetail._id.toString(),
    };

    const data = plainToInstance(LanguageResponseDto, preparedDetail, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Updated Language Succesfully',
      data: (instanceToPlain(data) as LanguageResponseDto) || null,
    };
  }

  async toggleLanguageVisibility(
    email: string,
    recordId: string,
  ): Promise<SuccessResponseDto<Boolean>> {
    const res = await this.userRepository.toggleLanguageVisibility(
      email,
      recordId,
    );

    if (res !== true && res !== false) {
      throw new HttpException(
        'Something went Wrong while toggling Language Visibility',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      success: true,
      message: 'Toggled Language Visibility Succesfully',
      data: res,
    };
  }

  async deleteLanguage(
    email: string,
    recordId: string,
  ): Promise<SuccessResponseDto<LanguageResponseDto[]>> {
    const res = await this.userRepository.deleteLanguage(email, recordId);

    if (!res) {
      throw new HttpException(
        'No Language found with the given ID',
        HttpStatus.NOT_FOUND,
      );
    }

    const preparedDetails = res.languages.map((detail) => {
      return {
        ...detail,
        _id: detail._id.toString(),
      };
    });

    const data = plainToInstance(LanguageResponseDto, preparedDetails, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Deleted Language Succesfully',
      data: (instanceToPlain(data) as LanguageResponseDto[]) || [],
    };
  }
}

@Injectable()
export class Certificate_ProfileService {
  constructor(private readonly userRepository: UserRepository) {}

  async getCertificates(
    email: string,
  ): Promise<SuccessResponseDto<CertificateResponseDto[]>> {
    const res = await this.userRepository.findUserByEmail(email);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while fetching Certificates',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    let preparedDetails;
    let data;

    if (res.certificates && res.certificates.length > 0) {
      preparedDetails = res.certificates.map((detail) => {
        return {
          ...detail,
          _id: detail._id.toString(),
        };
      });

      data = plainToInstance(CertificateResponseDto, preparedDetails, {
        excludeExtraneousValues: true,
      });
    } else {
      data = [];
    }

    return {
      success: true,
      message: 'Fetched Certificates Succesfully',
      data: data,
    };
  }

  async addCertificate(
    email: string,
    details: CertificateDto,
  ): Promise<SuccessResponseDto<CertificateResponseDto>> {
    details._id = new ObjectId();
    const res = await this.userRepository.addCertificate(email, details);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while adding Certificate',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const addedDetail = res.certificates[res.certificates.length - 1];

    const preparedDetail = {
      ...addedDetail,
      _id: addedDetail._id.toString(),
    };

    const data = plainToInstance(CertificateResponseDto, preparedDetail, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Added Certificate Succesfully',
      data: (instanceToPlain(data) as CertificateResponseDto) || null,
    };
  }

  async updateCertificate(
    email: string,
    recordId: string,
    details: any,
  ): Promise<SuccessResponseDto<CertificateResponseDto>> {
    const res = await this.userRepository.updateCertificate(
      email,
      recordId,
      details,
    );

    if (!res) {
      throw new HttpException(
        'Something went Wrong while updating Certificate',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const updatedDetail = res.certificates.find(
      (detail) => detail._id.toString() === recordId,
    );

    if (!updatedDetail) {
      throw new HttpException('Certificate not found', HttpStatus.NOT_FOUND);
    }

    const preparedDetail = {
      ...updatedDetail,
      _id: updatedDetail._id.toString(),
    };

    const data = plainToInstance(CertificateResponseDto, preparedDetail, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Updated Certificate Succesfully',
      data: (instanceToPlain(data) as CertificateResponseDto) || null,
    };
  }

  async toggleCertificateVisibility(
    email: string,
    recordId: string,
  ): Promise<SuccessResponseDto<Boolean>> {
    const res = await this.userRepository.toggleCertificateVisibility(
      email,
      recordId,
    );

    if (res !== true && res !== false) {
      throw new HttpException(
        'Something went Wrong while toggling Certificate Visibility',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      success: true,
      message: 'Toggled Certificate Visibility Succesfully',
      data: res,
    };
  }

  async deleteCertificate(
    email: string,
    recordId: string,
  ): Promise<SuccessResponseDto<CertificateResponseDto[]>> {
    const res = await this.userRepository.deleteCertificate(email, recordId);

    if (!res) {
      throw new HttpException(
        'No Certificate found with the given ID',
        HttpStatus.NOT_FOUND,
      );
    }

    const preparedDetails = res.certificates.map((detail) => {
      return {
        ...detail,
        _id: detail._id.toString(),
      };
    });

    const data = plainToInstance(CertificateResponseDto, preparedDetails, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Deleted Certificate Succesfully',
      data: (instanceToPlain(data) as CertificateResponseDto[]) || [],
    };
  }
}

@Injectable()
export class Project_ProfileService {
  constructor(private readonly userRepository: UserRepository) {}

  async getProjects(
    email: string,
  ): Promise<SuccessResponseDto<ProjectResponseDto[]>> {
    const res = await this.userRepository.findUserByEmail(email);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while fetching Projects',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    let preparedDetails;
    let data;

    if (res.projects && res.projects.length > 0) {
      preparedDetails = res.projects.map((detail) => {
        return {
          ...detail,
          _id: detail._id.toString(),
        };
      });

      data = plainToInstance(ProjectResponseDto, preparedDetails, {
        excludeExtraneousValues: true,
      });

      data = instanceToPlain(data) as ProjectResponseDto[];
    } else {
      data = [];
    }

    return {
      success: true,
      message: 'Fetched Projects Succesfully',
      data: data,
    };
  }

  async addProject(
    email: string,
    details: ProjectDto,
  ): Promise<SuccessResponseDto<ProjectResponseDto>> {
    details._id = new ObjectId();
    const res = await this.userRepository.addProject(email, details);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while adding Project',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const addedDetail = res.projects[res.projects.length - 1];

    const preparedDetail = {
      ...addedDetail,
      _id: addedDetail._id.toString(),
    };

    const data = plainToInstance(ProjectResponseDto, preparedDetail, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Added Project Succesfully',
      data: (instanceToPlain(data) as ProjectResponseDto) || null,
    };
  }

  async updateProject(
    email: string,
    recordId: string,
    details: any,
  ): Promise<SuccessResponseDto<ProjectResponseDto>> {
    const res = await this.userRepository.updateProject(
      email,
      recordId,
      details,
    );

    if (!res) {
      throw new HttpException(
        'Something went Wrong while updating Project',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const updatedDetail = res.projects.find(
      (detail) => detail._id.toString() === recordId,
    );

    if (!updatedDetail) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }

    const preparedDetail = {
      ...updatedDetail,
      _id: updatedDetail._id.toString(),
    };

    const data = plainToInstance(ProjectResponseDto, preparedDetail, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Updated Project Succesfully',
      data: (instanceToPlain(data) as ProjectResponseDto) || null,
    };
  }

  async toggleProjectVisibility(
    email: string,
    recordId: string,
  ): Promise<SuccessResponseDto<Boolean>> {
    const res = await this.userRepository.toggleProjectVisibility(
      email,
      recordId,
    );

    if (res !== true && res !== false) {
      throw new HttpException(
        'Something went Wrong while toggling Project Visibility',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      success: true,
      message: 'Toggled Project Visibility Succesfully',
      data: res,
    };
  }

  async deleteProject(
    email: string,
    recordId: string,
  ): Promise<SuccessResponseDto<ProjectResponseDto[]>> {
    const res = await this.userRepository.deleteProject(email, recordId);

    if (!res) {
      throw new HttpException(
        'No Project found with the given ID',
        HttpStatus.NOT_FOUND,
      );
    }

    const preparedDetails = res.projects.map((detail) => {
      return {
        ...detail,
        _id: detail._id.toString(),
      };
    });

    const data = plainToInstance(ProjectResponseDto, preparedDetails, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Deleted Project Succesfully',
      data: (instanceToPlain(data) as ProjectResponseDto[]) || [],
    };
  }
}

@Injectable()
export class Award_ProfileService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAwards(
    email: string,
  ): Promise<SuccessResponseDto<AwardResponseDto[]>> {
    const res = await this.userRepository.findUserByEmail(email);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while fetching Awards',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    let preparedDetails;
    let data;

    if (res.awards && res.awards.length > 0) {
      preparedDetails = res.awards.map((detail) => {
        return {
          ...detail,
          _id: detail._id.toString(),
        };
      });

      data = plainToInstance(AwardResponseDto, preparedDetails, {
        excludeExtraneousValues: true,
      });

      data = instanceToPlain(data) as AwardResponseDto[];
    } else {
      data = [];
    }

    return {
      success: true,
      message: 'Fetched Awards Succesfully',
      data: data,
    };
  }

  async addAward(
    email: string,
    details: AwardDto,
  ): Promise<SuccessResponseDto<AwardResponseDto>> {
    details._id = new ObjectId();
    const res = await this.userRepository.addAward(email, details);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while adding Award',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const addedDetail = res.awards[res.awards.length - 1];

    const preparedDetail = {
      ...addedDetail,
      _id: addedDetail._id.toString(),
    };

    const data = plainToInstance(AwardResponseDto, preparedDetail, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Added Award Succesfully',
      data: (instanceToPlain(data) as AwardResponseDto) || null,
    };
  }

  async updateAward(
    email: string,
    recordId: string,
    details: any,
  ): Promise<SuccessResponseDto<AwardResponseDto>> {
    const res = await this.userRepository.updateAward(email, recordId, details);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while updating Award',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const updatedDetail = res.awards.find(
      (detail) => detail._id.toString() === recordId,
    );

    if (!updatedDetail) {
      throw new HttpException('Award not found', HttpStatus.NOT_FOUND);
    }

    const preparedDetail = {
      ...updatedDetail,
      _id: updatedDetail._id.toString(),
    };

    const data = plainToInstance(AwardResponseDto, preparedDetail, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Updated Award Succesfully',
      data: (instanceToPlain(data) as AwardResponseDto) || null,
    };
  }

  async toggleAwardVisibility(
    email: string,
    recordId: string,
  ): Promise<SuccessResponseDto<Boolean>> {
    const res = await this.userRepository.toggleAwardVisibility(
      email,
      recordId,
    );

    if (res !== true && res !== false) {
      throw new HttpException(
        'Something went Wrong while toggling Award Visibility',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      success: true,
      message: 'Toggled Award Visibility Succesfully',
      data: res,
    };
  }

  async deleteAward(
    email: string,
    recordId: string,
  ): Promise<SuccessResponseDto<AwardResponseDto[]>> {
    const res = await this.userRepository.deleteAward(email, recordId);

    if (!res) {
      throw new HttpException(
        'No Award found with the given ID',
        HttpStatus.NOT_FOUND,
      );
    }

    const preparedDetails = res.awards.map((detail) => {
      return {
        ...detail,
        _id: detail._id.toString(),
      };
    });

    const data = plainToInstance(AwardResponseDto, preparedDetails, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Deleted Award Succesfully',
      data: (instanceToPlain(data) as AwardResponseDto[]) || [],
    };
  }
}

@Injectable()
export class Course_ProfileService {
  constructor(private readonly userRepository: UserRepository) {}

  async getCourses(
    email: string,
  ): Promise<SuccessResponseDto<CourseResponseDto[]>> {
    const res = await this.userRepository.findUserByEmail(email);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while fetching Courses',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    let preparedDetails;
    let data;

    if (res.courses && res.courses.length > 0) {
      preparedDetails = res.courses.map((detail) => {
        return {
          ...detail,
          _id: detail._id.toString(),
        };
      });

      data = plainToInstance(CourseResponseDto, preparedDetails, {
        excludeExtraneousValues: true,
      });

      data = instanceToPlain(data) as CourseResponseDto[];
    } else {
      data = [];
    }

    return {
      success: true,
      message: 'Fetched Courses Succesfully',
      data: data,
    };
  }

  async addCourse(
    email: string,
    details: CourseDto,
  ): Promise<SuccessResponseDto<CourseResponseDto>> {
    details._id = new ObjectId();
    const res = await this.userRepository.addCourse(email, details);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while adding Course',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const addedDetail = res.courses[res.courses.length - 1];

    const preparedDetail = {
      ...addedDetail,
      _id: addedDetail._id.toString(),
    };

    const data = plainToInstance(CourseResponseDto, preparedDetail, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Added Course Succesfully',
      data: (instanceToPlain(data) as CourseResponseDto) || null,
    };
  }

  async updateCourse(
    email: string,
    recordId: string,
    details: any,
  ): Promise<SuccessResponseDto<CourseResponseDto>> {
    const res = await this.userRepository.updateCourse(
      email,
      recordId,
      details,
    );

    if (!res) {
      throw new HttpException(
        'Something went Wrong while updating Course',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const updatedDetail = res.courses.find(
      (detail) => detail._id.toString() === recordId,
    );

    if (!updatedDetail) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }

    const preparedDetail = {
      ...updatedDetail,
      _id: updatedDetail._id.toString(),
    };

    const data = plainToInstance(CourseResponseDto, preparedDetail, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Updated Course Succesfully',
      data: (instanceToPlain(data) as CourseResponseDto) || null,
    };
  }

  async toggleCourseVisibility(
    email: string,
    recordId: string,
  ): Promise<SuccessResponseDto<Boolean>> {
    const res = await this.userRepository.toggleCourseVisibility(
      email,
      recordId,
    );

    if (res !== true && res !== false) {
      throw new HttpException(
        'Something went Wrong while toggling Course Visibility',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      success: true,
      message: 'Toggled Course Visibility Succesfully',
      data: res,
    };
  }

  async deleteCourse(
    email: string,
    recordId: string,
  ): Promise<SuccessResponseDto<CourseResponseDto[]>> {
    const res = await this.userRepository.deleteCourse(email, recordId);

    if (!res) {
      throw new HttpException(
        'No Course found with the given ID',
        HttpStatus.NOT_FOUND,
      );
    }

    const preparedDetails = res.courses.map((detail) => {
      return {
        ...detail,
        _id: detail._id.toString(),
      };
    });

    const data = plainToInstance(CourseResponseDto, preparedDetails, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Deleted Course Succesfully',
      data: (instanceToPlain(data) as CourseResponseDto[]) || [],
    };
  }
}

@Injectable()
export class Organization_ProfileService {
  constructor(private readonly userRepository: UserRepository) {}

  async getOrganizations(
    email: string,
  ): Promise<SuccessResponseDto<OrganizationResponseDto[]>> {
    const res = await this.userRepository.findUserByEmail(email);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while fetching Organizations',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    let preparedDetails;
    let data;

    if (res.organizations && res.organizations.length > 0) {
      preparedDetails = res.organizations.map((detail) => {
        return {
          ...detail,
          _id: detail._id.toString(),
        };
      });

      data = plainToInstance(OrganizationResponseDto, preparedDetails, {
        excludeExtraneousValues: true,
      });

      data = instanceToPlain(data) as OrganizationResponseDto[];
    } else {
      data = [];
    }

    return {
      success: true,
      message: 'Fetched Organizations Succesfully',
      data: data,
    };
  }

  async addOrganization(
    email: string,
    details: OrganizationDto,
  ): Promise<SuccessResponseDto<OrganizationResponseDto>> {
    details._id = new ObjectId();
    const res = await this.userRepository.addOrganization(email, details);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while adding Organization',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const addedDetail = res.organizations[res.organizations.length - 1];

    const preparedDetail = {
      ...addedDetail,
      _id: addedDetail._id.toString(),
    };

    const data = plainToInstance(OrganizationResponseDto, preparedDetail, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Added Organization Succesfully',
      data: (instanceToPlain(data) as OrganizationResponseDto) || null,
    };
  }

  async updateOrganization(
    email: string,
    recordId: string,
    details: any,
  ): Promise<SuccessResponseDto<OrganizationResponseDto>> {
    const res = await this.userRepository.updateOrganization(
      email,
      recordId,
      details,
    );

    if (!res) {
      throw new HttpException(
        'Something went Wrong while updating Organization',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const updatedDetail = res.organizations.find(
      (detail) => detail._id.toString() === recordId,
    );

    if (!updatedDetail) {
      throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
    }

    const preparedDetail = {
      ...updatedDetail,
      _id: updatedDetail._id.toString(),
    };

    const data = plainToInstance(OrganizationResponseDto, preparedDetail, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Updated Organization Succesfully',
      data: (instanceToPlain(data) as OrganizationResponseDto) || null,
    };
  }

  async toggleOrganizationVisibility(
    email: string,
    recordId: string,
  ): Promise<SuccessResponseDto<Boolean>> {
    const res = await this.userRepository.toggleOrganizationVisibility(
      email,
      recordId,
    );

    if (res !== true && res !== false) {
      throw new HttpException(
        'Something went Wrong while toggling Organization Visibility',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      success: true,
      message: 'Toggled Organization Visibility Succesfully',
      data: res,
    };
  }

  async deleteOrganization(
    email: string,
    recordId: string,
  ): Promise<SuccessResponseDto<OrganizationResponseDto[]>> {
    const res = await this.userRepository.deleteOrganization(email, recordId);

    if (!res) {
      throw new HttpException(
        'No Organization found with the given ID',
        HttpStatus.NOT_FOUND,
      );
    }

    const preparedDetails = res.organizations.map((detail) => {
      return {
        ...detail,
        _id: detail._id.toString(),
      };
    });

    const data = plainToInstance(OrganizationResponseDto, preparedDetails, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Deleted Organization Succesfully',
      data: (instanceToPlain(data) as OrganizationResponseDto[]) || [],
    };
  }
}

@Injectable()
export class Publication_ProfileService {
  constructor(private readonly userRepository: UserRepository) {}

  async getPublications(
    email: string,
  ): Promise<SuccessResponseDto<PublicationResponseDto[]>> {
    const res = await this.userRepository.findUserByEmail(email);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while fetching Publications',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    let preparedDetails;
    let data;

    if (res.publications && res.publications.length > 0) {
      preparedDetails = res.publications.map((detail) => {
        return {
          ...detail,
          _id: detail._id.toString(),
        };
      });

      data = plainToInstance(PublicationResponseDto, preparedDetails, {
        excludeExtraneousValues: true,
      });

      data = instanceToPlain(data) as PublicationResponseDto[];
    } else {
      data = [];
    }

    return {
      success: true,
      message: 'Fetched Publications Succesfully',
      data: data,
    };
  }

  async addPublication(
    email: string,
    details: PublicationDto,
  ): Promise<SuccessResponseDto<PublicationResponseDto>> {
    details._id = new ObjectId();
    const res = await this.userRepository.addPublication(email, details);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while adding Publication',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const addedDetail = res.publications[res.publications.length - 1];

    const preparedDetail = {
      ...addedDetail,
      _id: addedDetail._id.toString(),
    };

    const data = plainToInstance(PublicationResponseDto, preparedDetail, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Added Publication Succesfully',
      data: (instanceToPlain(data) as PublicationResponseDto) || null,
    };
  }

  async updatePublication(
    email: string,
    recordId: string,
    details: any,
  ): Promise<SuccessResponseDto<PublicationResponseDto>> {
    const res = await this.userRepository.updatePublication(
      email,
      recordId,
      details,
    );

    if (!res) {
      throw new HttpException(
        'Something went Wrong while updating Publication',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const updatedDetail = res.publications.find(
      (detail) => detail._id.toString() === recordId,
    );

    if (!updatedDetail) {
      throw new HttpException('Publication not found', HttpStatus.NOT_FOUND);
    }

    const preparedDetail = {
      ...updatedDetail,
      _id: updatedDetail._id.toString(),
    };

    const data = plainToInstance(PublicationResponseDto, preparedDetail, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Updated Publication Succesfully',
      data: (instanceToPlain(data) as PublicationResponseDto) || null,
    };
  }

  async togglePublicationVisibility(
    email: string,
    recordId: string,
  ): Promise<SuccessResponseDto<Boolean>> {
    const res = await this.userRepository.togglePublicationVisibility(
      email,
      recordId,
    );

    if (res !== true && res !== false) {
      throw new HttpException(
        'Something went Wrong while toggling Publication Visibility',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      success: true,
      message: 'Toggled Publication Visibility Succesfully',
      data: res,
    };
  }

  async deletePublication(
    email: string,
    recordId: string,
  ): Promise<SuccessResponseDto<PublicationResponseDto[]>> {
    const res = await this.userRepository.deletePublication(email, recordId);

    if (!res) {
      throw new HttpException(
        'No Publication found with the given ID',
        HttpStatus.NOT_FOUND,
      );
    }

    const preparedDetails = res.publications.map((detail) => {
      return {
        ...detail,
        _id: detail._id.toString(),
      };
    });

    const data = plainToInstance(PublicationResponseDto, preparedDetails, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Deleted Publication Succesfully',
      data: (instanceToPlain(data) as PublicationResponseDto[]) || [],
    };
  }
}

@Injectable()
export class Reference_ProfileService {
  constructor(private readonly userRepository: UserRepository) {}

  async getReferences(
    email: string,
  ): Promise<SuccessResponseDto<ReferenceResponseDto[]>> {
    const res = await this.userRepository.findUserByEmail(email);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while fetching References',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    let preparedDetails;
    let data;

    if (res.references && res.references.length > 0) {
      preparedDetails = res.references.map((detail) => {
        return {
          ...detail,
          _id: detail._id.toString(),
        };
      });

      data = plainToInstance(ReferenceResponseDto, preparedDetails, {
        excludeExtraneousValues: true,
      });

      data = instanceToPlain(data) as ReferenceResponseDto[];
    } else {
      data = [];
    }

    return {
      success: true,
      message: 'Fetched References Succesfully',
      data: data,
    };
  }

  async addReference(
    email: string,
    details: ReferenceDto,
  ): Promise<SuccessResponseDto<ReferenceResponseDto>> {
    details._id = new ObjectId();
    const res = await this.userRepository.addReference(email, details);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while adding Reference',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const addedDetail = res.references[res.references.length - 1];

    const preparedDetail = {
      ...addedDetail,
      _id: addedDetail._id.toString(),
    };

    const data = plainToInstance(ReferenceResponseDto, preparedDetail, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Added Reference Succesfully',
      data: (instanceToPlain(data) as ReferenceResponseDto) || null,
    };
  }

  async updateReference(
    email: string,
    recordId: string,
    details: any,
  ): Promise<SuccessResponseDto<ReferenceResponseDto>> {
    const res = await this.userRepository.updateReference(
      email,
      recordId,
      details,
    );

    if (!res) {
      throw new HttpException(
        'Something went Wrong while updating Reference',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const updatedDetail = res.references.find(
      (detail) => detail._id.toString() === recordId,
    );

    if (!updatedDetail) {
      throw new HttpException('Reference not found', HttpStatus.NOT_FOUND);
    }

    const preparedDetail = {
      ...updatedDetail,
      _id: updatedDetail._id.toString(),
    };

    const data = plainToInstance(ReferenceResponseDto, preparedDetail, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Updated Reference Succesfully',
      data: (instanceToPlain(data) as ReferenceResponseDto) || null,
    };
  }

  async toggleReferenceVisibility(
    email: string,
    recordId: string,
  ): Promise<SuccessResponseDto<Boolean>> {
    const res = await this.userRepository.toggleReferenceVisibility(
      email,
      recordId,
    );

    if (res !== true && res !== false) {
      throw new HttpException(
        'Something went Wrong while toggling Reference Visibility',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      success: true,
      message: 'Toggled Reference Visibility Succesfully',
      data: res,
    };
  }

  async deleteReference(
    email: string,
    recordId: string,
  ): Promise<SuccessResponseDto<ReferenceResponseDto[]>> {
    const res = await this.userRepository.deleteReference(email, recordId);

    if (!res) {
      throw new HttpException(
        'No Reference found with the given ID',
        HttpStatus.NOT_FOUND,
      );
    }

    const preparedDetails = res.references.map((detail) => {
      return {
        ...detail,
        _id: detail._id.toString(),
      };
    });

    const data = plainToInstance(ReferenceResponseDto, preparedDetails, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Deleted Reference Succesfully',
      data: (instanceToPlain(data) as ReferenceResponseDto[]) || [],
    };
  }
}

@Injectable()
export class Declaration_ProfileService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getDeclaration(
    email: string,
  ): Promise<SuccessResponseDto<DeclarationResponseDto>> {
    const res = await this.userRepository.findUserByEmail(email);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while fetching Declaration',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    let preparedDetails;
    let data;

    if (res.declaration) {
      preparedDetails = res.declaration;
      data = plainToInstance(DeclarationResponseDto, preparedDetails, {
        excludeExtraneousValues: true,
      });
    } else {
      data = null;
    }

    return {
      success: true,
      message: 'Fetched Declaration Succesfully',
      data: (instanceToPlain(data) as DeclarationResponseDto) || null,
    };
  }

  async updateDeclaration(
    email: string,
    details: DeclarationDto,
  ): Promise<SuccessResponseDto<DeclarationResponseDto>> {
    const res = await this.userRepository.updateDeclaration(email, details);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while updating Declaration',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const preparedDetail = {
      ...res.declaration,
    };

    const data = plainToInstance(DeclarationResponseDto, preparedDetail, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      message: 'Updated Declaration Succesfully',
      data: (instanceToPlain(data) as DeclarationResponseDto) || null,
    };
  }

  async toggleDeclarationVisibility(
    email: string,
  ): Promise<SuccessResponseDto<Boolean>> {
    const res = await this.userRepository.toggleDeclarationVisibility(email);

    if (res !== true && res !== false) {
      throw new HttpException(
        'Something went Wrong while toggling Declaration Visibility',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      success: true,
      message: 'Toggled Declaration Visibility Succesfully',
      data: res,
    };
  }

  async getDeclarationSignature(
    email: string,
  ): Promise<SuccessResponseDto<string>> {
    const res = await this.userRepository.findUserByEmail(email);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while fetching Declaration Signature',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!res.declaration) {
      throw new HttpException('Declaration not found', HttpStatus.NOT_FOUND);
    }

    const signature = res.declaration.signature;

    return {
      success: true,
      message: 'Fetched Declaration Signature Succesfully',
      data: signature,
    };
  }

  async updateDeclarationSignature(
    email: string,
    signature: Express.Multer.File,
  ): Promise<SuccessResponseDto<{ url: string; publicId: string }>> {
    const uploadedImage = await this.cloudinaryService.uploadImage(signature);

    const res = await this.userRepository.updateDeclarationSignature(
      email,
      uploadedImage.url,
      uploadedImage.publicId,
    );

    if (!res) {
      throw new HttpException(
        'Something went Wrong while updating Declaration Signature',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      success: true,
      message: 'Updated Declaration Signature Succesfully',
      data: uploadedImage,
    };
  }

  async removeDeclarationSignature(
    email: string,
  ): Promise<SuccessResponseDto<string>> {
    const res = await this.userRepository.removeDeclarationSignature(email);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while removing Declaration Signature',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      success: true,
      message: 'Removed Declaration Signature Succesfully',
      data: null,
    };
  }
}
