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

@Injectable()
export class Skill_ProfileService {
  constructor(private readonly userRepository: UserRepository) {}

  async getSkills(email: string): Promise<SuccessResponseDto<SkillResponseDto[]>> {
    const res = await this.userRepository.findUserByEmail(email);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while fetching Skills',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    let preparedDetails;
    let data;

    if(res.skills && res.skills.length > 0) {
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

  async addSkill(email: string, details: SkillDto): Promise<SuccessResponseDto<SkillResponseDto>> {
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

  async updateSkill(email: string, recordId: string, details: any): Promise<SuccessResponseDto<SkillResponseDto>> {
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
      throw new HttpException(
        'Skill not found',
        HttpStatus.NOT_FOUND,
      );
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

  async toggleSkillVisibility(email: string, recordId: string): Promise<SuccessResponseDto<Boolean>> {
    const res = await this.userRepository.toggleSkillVisibility(email, recordId);

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

  async deleteSkill(email: string, recordId: string): Promise<SuccessResponseDto<SkillResponseDto[]>> {
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

  async getLanguages(email: string): Promise<SuccessResponseDto<LanguageResponseDto[]>> {
    const res = await this.userRepository.findUserByEmail(email);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while fetching Languages',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    let preparedDetails;
    let data;

    if(res.languages && res.languages.length > 0) {
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

  async addLanguage(email: string, details: LanguageDto): Promise<SuccessResponseDto<LanguageResponseDto>> {
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

  async updateLanguage(email: string, recordId: string, details: any): Promise<SuccessResponseDto<LanguageResponseDto>> {
    const res = await this.userRepository.updateLanguage(email, recordId, details);

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
      throw new HttpException(
        'Language not found',
        HttpStatus.NOT_FOUND,
      );
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

  async toggleLanguageVisibility(email: string, recordId: string): Promise<SuccessResponseDto<Boolean>> {
    const res = await this.userRepository.toggleLanguageVisibility(email, recordId);

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

  async deleteLanguage(email: string, recordId: string): Promise<SuccessResponseDto<LanguageResponseDto[]>> {
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

  async getCertificates(email: string): Promise<SuccessResponseDto<CertificateResponseDto[]>> {
    const res = await this.userRepository.findUserByEmail(email);

    if (!res) {
      throw new HttpException(
        'Something went Wrong while fetching Certificates',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    let preparedDetails;
    let data;

    if(res.certificates && res.certificates.length > 0) {
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

  async addCertificate(email: string, details: CertificateDto): Promise<SuccessResponseDto<CertificateResponseDto>> {
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

  async updateCertificate(email: string, recordId: string, details: any): Promise<SuccessResponseDto<CertificateResponseDto>> {   
    const res = await this.userRepository.updateCertificate(email, recordId, details);

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
      throw new HttpException(
        'Certificate not found',
        HttpStatus.NOT_FOUND,
      );
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
  
  async toggleCertificateVisibility(email: string, recordId: string): Promise<SuccessResponseDto<Boolean>> {
    const res = await this.userRepository.toggleCertificateVisibility(email, recordId);

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

  async deleteCertificate(email: string, recordId: string): Promise<SuccessResponseDto<CertificateResponseDto[]>> {
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
