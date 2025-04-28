import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import { MongoService } from '../Mongo/mongo.service';
import { User, USER_COLLECTION } from '../Mongo/Schema/user.schema';
import {
  ProfileSummaryResponseDto,
} from 'src/profile/dto/profile.dto';

// try{

// }catch(error){
//   console.log("Something went Wrong while performing Database Operation: updateUserProfileSummary ", error);
// }

@Injectable()
export class UserRepository {
  private collection: Collection<User>;

  constructor(private readonly mongo: MongoService) {}

  async onModuleInit() {
    const db = await this.mongo.getDb();
    this.collection = db.collection<User>(USER_COLLECTION);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      return this.collection.findOne({ email });
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: findUserByEmail ',
        error,
      );
      return null;
    }
  }

  async createNewUser(
    email: string,
    password: string,
    name: string,
  ): Promise<Boolean> {
    try {
      const user = await this.collection.insertOne({
        name,
        email,
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
        hideProfilePicture: false,
        hideProfileSummary: false,
      });

      return user.acknowledged;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: createNewUser ',
        error,
      );
      return false;
    }
  }

  async updateUserProfileSummary(
    email: string,
    summary: string,
  ): Promise<ProfileSummaryResponseDto> {
    try {
      const user = await this.collection.findOneAndUpdate(
        { email },
        {
          $set: { profileSummary: summary },
        },
        {
          returnDocument: 'after',
        },
      );
      return { summary: user.profileSummary, hide: user.hideProfileSummary };
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: updateUserProfileSummary ',
        error,
      );
      return null;
    }
  }

  async toggleProfileSummaryVisibility(email: string): Promise<Boolean> {
    try {
      const user = await this.collection.findOne({ email });
      if (!user) {
        console.log('User not found');
        return false;
      }

      const newVisibility = !user.hideProfileSummary;

      const data = await this.collection.findOneAndUpdate(
        { email },
        { $set: { hideProfileSummary: newVisibility } },
        { returnDocument: 'after' },
      );

      return data.hideProfileSummary;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: toggleProfileSummaryVisibility ',
        error,
      );
      return null;
    }
  }

  async findUserPersonalDetails(email: string) {
    try {
      const data = await this.collection.findOne({
        email,
      });

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: findUserPersonalDetails',
        error,
      );
      return null;
    }
  }

  async updateUserPersonalDetails(email: string, details: any) {
    try {
      const data = await this.collection.findOneAndUpdate(
        { email },
        { $set: { personalDetails: details } },
        { returnDocument: 'after' },
      );

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: updateUserPersonalDetails',
        error,
      );
      return null;
    }
  }

  async addEducationDetail(email: string, details: any) {
    try {
      const data = await this.collection.findOneAndUpdate(
        { email },
        { $push: { educationDetails: details } },
        { returnDocument: 'after' },
      );

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: addEducationDetail',
        error,
      );
      return null;
    }
  }

  async updateEducationDetail(email: string, details: any, recordId: string) {
    try {
      const updateFields = {};
      for (const key in details) {
        updateFields[`educationDetails.$.${key}`] = details[key];
      }

      const data = await this.collection.findOneAndUpdate(
        { email, 'educationDetails._id': new ObjectId(recordId) },
        { $set: updateFields },
        { returnDocument: 'after' },
      );

      if (!data) {
        console.log('No record found with the given ID');
        return null;
      }

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: updateEducationDetail',
        error,
      );
      return null;
    }
  }

  async toggleEducationDetailVisibility(email: string, recordId: string) {
    try {
      const user = await this.collection.findOne({ email });

      if (!user) {
        throw new HttpException(
          'User not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (!user.educationDetails || user.educationDetails.length === 0) {
        throw new HttpException(
          'No education details found',
          HttpStatus.NOT_FOUND,
        );
      }

      const educationDetails = user.educationDetails;

      const educationDetail = educationDetails.find(
        (detail) => detail._id.toString() === recordId,
      );

      if (!educationDetail) {
        throw new HttpException(
          'No Education Detail found with the given ID',
          HttpStatus.NOT_FOUND,
        );
      }

      const data = await this.collection.findOneAndUpdate(
        { email, 'educationDetails._id': new ObjectId(recordId) },
        { $set: { 'educationDetails.$.hide': !educationDetail.hide } },
        { returnDocument: 'after' },
      );

      if (!data) {
        console.log('No record found with the given ID');
        return null;
      }

      return data.educationDetails.find(
        (detail) => detail._id.toString() === recordId,
      ).hide;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: toggleEducationDetailVisibility',
        error,
      );
      return null;
    }
  }

  async deleteEducationDetail(email: string, recordId: string) {
    try {
      const data = await this.collection.findOneAndUpdate(
        { email, 'educationDetails._id': new ObjectId(recordId) },
        { $pull: { educationDetails: { _id: new ObjectId(recordId) } } },
        { returnDocument: 'after' },
      );

      if (!data) {
        console.log('No record found with the given ID');
        return null;
      }

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: deleteEducationDetail',
        error,
      );
      return null;
    }
  }

  async addProfessionalExperience(email: string, details: any) {
    try {
      const data = await this.collection.findOneAndUpdate(
        { email },
        { $push: { professionalExperience: details } },
        { returnDocument: 'after' },
      );

      if (!data) {
        console.log('No record found with the given ID');
        return null;
      }

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: addProfessionalExperience',
        error,
      );
      return null;
    }
  }

  async updateProfessionalExperience(email: string, details: any, recordId: string) {
    try {
      const updateFields = {};
      for (const key in details) {
        updateFields[`professionalExperience.$.${key}`] = details[key];
      }

      const data = await this.collection.findOneAndUpdate(
        { email, 'professionalExperience._id': new ObjectId(recordId) },
        { $set: updateFields },
        { returnDocument: 'after' },
      );

      if (!data) {
        console.log('No record found with the given ID');
        return null;
      }

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: updateProfessionalExperience',
        error,
      );
      return null;
    }
  }

  async toggleProfessionalExperienceVisibility(email: string, recordId: string) {
    try {
      const user = await this.collection.findOne({ email });

      if (!user) {
        throw new HttpException(
          'User not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (!user.professionalExperience || user.professionalExperience.length === 0) {
        throw new HttpException(
          'No professional experience found',
          HttpStatus.NOT_FOUND,
        );
      }

      const professionalExperience = user.professionalExperience;

      const professionalExperienceDetail = professionalExperience.find(
        (detail) => detail._id.toString() === recordId,
      );

      if (!professionalExperienceDetail) {
        throw new HttpException(
          'No Professional Experience found with the given ID',
          HttpStatus.NOT_FOUND,
        );
      }

      const data = await this.collection.findOneAndUpdate(
        { email, 'professionalExperience._id': new ObjectId(recordId) },
        { $set: { 'professionalExperience.$.hide': !professionalExperienceDetail.hide } },
        { returnDocument: 'after' },
      );

      if (!data) {
        console.log('No record found with the given ID');
        return null;
      }

      return data.professionalExperience.find(
        (detail) => detail._id.toString() === recordId,
      ).hide;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: toggleProfessionalExperienceVisibility',
        error,
      );
      return null;
    }
  }

  async deleteProfessionalExperience(email: string, recordId: string) {
    try {
      const data = await this.collection.findOneAndUpdate(
        { email, 'professionalExperience._id': new ObjectId(recordId) },
        { $pull: { professionalExperience: { _id: new ObjectId(recordId) } } },
        { returnDocument: 'after' },
      );

      if (!data) {
        console.log('No record found with the given ID');
        return null;
      }

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: deleteProfessionalExperience',
        error,
      );
      return null;
    }
  }

  async addSkill(email: string, details: any) {
    try {
      const data = await this.collection.findOneAndUpdate(
        { email },
        { $push: { skills: details } },
        { returnDocument: 'after' },
      );

      if (!data) {
        console.log('No record found with the given ID');
        return null;
      }

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: addSkill',
        error,
      );
      return null;
    }
  }

  async updateSkill(email: string, recordId: string, details: any) {
    try {
      const updateFields = {};
      for (const key in details) {
        updateFields[`skills.$.${key}`] = details[key];
      }

      const data = await this.collection.findOneAndUpdate(
        { email, 'skills._id': new ObjectId(recordId) },
        { $set: updateFields },
        { returnDocument: 'after' },
      );

      if (!data) {
        console.log('No record found with the given ID');
        return null;
      }

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: updateSkill',
        error,
      );
      return null;
    }
  }

  async toggleSkillVisibility(email: string, recordId: string): Promise<Boolean> {
    try {
      const user = await this.collection.findOne({ email });
      if (!user) {
        throw new HttpException(
          'User not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (!user.skills || user.skills.length === 0) {
        throw new HttpException(
          'No Skills found',
          HttpStatus.NOT_FOUND,
        );
      }

      const skill = user.skills.find((s) => s._id.toString() === recordId);
      if (!skill) {
        throw new HttpException(
          'No Skill found with the given ID',
          HttpStatus.NOT_FOUND,
        );
      }

      const newVisibility = !skill.hide;

      const data = await this.collection.findOneAndUpdate(
        { email, 'skills._id': new ObjectId(recordId) },
        { $set: { 'skills.$.hide': newVisibility } },
        { returnDocument: 'after' },
      );

      if (!data) {
        console.log('No record found with the given ID');
        return null;
      }

      return data.skills.find((s) => s._id.toString() === recordId).hide;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: toggleSkillVisibility',
        error,
      );
      return null;
    }
  }

  async deleteSkill(email: string, recordId: string): Promise<User | null> {
    try {
      const data = await this.collection.findOneAndUpdate(
        { email, 'skills._id': new ObjectId(recordId) },
        { $pull: { skills: { _id: new ObjectId(recordId) } } },
        { returnDocument: 'after' },
      );

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: deleteSkill',
        error,
      );
      return null;
    }
  }

  async addLanguage(email: string, details: any) {
    try {
      const data = await this.collection.findOneAndUpdate(
        { email },
        { $push: { languages: details } },
        { returnDocument: 'after' },
      );

      if (!data) {
        console.log('No record found with the given ID');
        return null;
      }

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: addLanguage',
        error,
      );

      return null;
    }
  }

  async updateLanguage(email: string, recordId: string, details: any) {
    try {
      const updateFields = {};

      for (const key in details) {
        updateFields[`languages.$.${key}`] = details[key];
      }

      const data = await this.collection.findOneAndUpdate(
        { email, 'languages._id': new ObjectId(recordId) },
        { $set: updateFields },
        { returnDocument: 'after' },
      );

      if (!data) {
        console.log('No record found with the given ID');
        return null;
      }

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: updateLanguage',
        error,
      );
      return null;
    }
  }

  async toggleLanguageVisibility(email: string, recordId: string): Promise<Boolean> {
    try {
      const user = await this.collection.findOne({ email });
      if (!user) {
        throw new HttpException(
          'User not found',
          HttpStatus.NOT_FOUND,
        );
      } 

      if (!user.languages || user.languages.length === 0) {
        throw new HttpException(
          'No Languages found',
          HttpStatus.NOT_FOUND,
        );
      }

      const language = user.languages.find((l) => l._id.toString() === recordId);
      if (!language) {
        throw new HttpException(
          'No Language found with the given ID',
          HttpStatus.NOT_FOUND,
        );
      }

      const newVisibility = !language.hide;

      const data = await this.collection.findOneAndUpdate(
        { email, 'languages._id': new ObjectId(recordId) },
        { $set: { 'languages.$.hide': newVisibility } },
        { returnDocument: 'after' },
      );

      if (!data) {
        console.log('No record found with the given ID');
        return null;
      }

      return data.languages.find((l) => l._id.toString() === recordId).hide;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: toggleLanguageVisibility',
        error,
      );
      return null;
    }
  }

  async deleteLanguage(email: string, recordId: string): Promise<User | null> {
    try {
      const data = await this.collection.findOneAndUpdate(
        { email, 'languages._id': new ObjectId(recordId) }, 
        { $pull: { languages: { _id: new ObjectId(recordId) } } },
        { returnDocument: 'after' },
      );

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: deleteLanguage',
        error,
      );
      return null;
    }
  }

  async addCertificate(email: string, details: any) {
    try {
      const data = await this.collection.findOneAndUpdate(
        { email },
        { $push: { certificates: details } },
        { returnDocument: 'after' },
      );

      if (!data) {
        console.log('No record found with the given ID');
        return null;
      }

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: addCertificate',
        error,
      );
      return null;
    }
  }

  async updateCertificate(email: string, recordId: string, details: any) {
    try {
      const updateFields = {};
      for (const key in details) {
        updateFields[`certificates.$.${key}`] = details[key];
      }

      const data = await this.collection.findOneAndUpdate(
        { email, 'certificates._id': new ObjectId(recordId) },
        { $set: updateFields },
        { returnDocument: 'after' },
      );

      if (!data) {
        console.log('No record found with the given ID');
        return null;
      }

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: updateCertificate',
        error,
      );
      return null;
    }
  }

  async toggleCertificateVisibility(email: string, recordId: string): Promise<Boolean> {
    try {
      const user = await this.collection.findOne({ email });
      if (!user) {
        throw new HttpException(
          'User not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (!user.certificates || user.certificates.length === 0) {
        throw new HttpException(
          'No Certificates found',
          HttpStatus.NOT_FOUND,
        );
      }

      const certificate = user.certificates.find((c) => c._id.toString() === recordId);
      if (!certificate) {
        throw new HttpException(
          'No Certificate found with the given ID',
          HttpStatus.NOT_FOUND,
        );
      }

      const newVisibility = !certificate.hide;

      const data = await this.collection.findOneAndUpdate(
        { email, 'certificates._id': new ObjectId(recordId) },
        { $set: { 'certificates.$.hide': newVisibility } },
        { returnDocument: 'after' },
      );

      if (!data) {
        console.log('No record found with the given ID');
        return null;
      }

      return data.certificates.find((c) => c._id.toString() === recordId).hide;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: toggleCertificateVisibility',
        error,
      );
      return null;
    }
  }

  async deleteCertificate(email: string, recordId: string): Promise<User | null> {
    try {
      const data = await this.collection.findOneAndUpdate(
        { email, 'certificates._id': new ObjectId(recordId) },
        { $pull: { certificates: { _id: new ObjectId(recordId) } } },
        { returnDocument: 'after' },
      );

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: deleteCertificate',
        error,
      );
      return null;
    }
  }
} 
