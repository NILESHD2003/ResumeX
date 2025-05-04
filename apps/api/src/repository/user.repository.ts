import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import { MongoService } from '../Mongo/mongo.service';
import { User, USER_COLLECTION } from '../Mongo/Schema/user.schema';
import { ProfileSummaryResponseDto } from 'src/profile/dto/profile';

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
      const updateFields = {};

      for (const key in details) {
        if (details[key] !== null && details[key] !== undefined) {
          updateFields[`personalDetails.${key}`] = details[key];
        }
      }
      
      const data = await this.collection.findOneAndUpdate(
        { email },
        { $set: updateFields },
        { returnDocument: 'after' }
      );
      
      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: updateUserPersonalDetails',
        error
      );
      return null;
    }
  }

  async updateProfileImage(email: string, url: string, publicId: string) {
    try {
      const data = await this.collection.findOneAndUpdate(
        { email },
        { $set: { profilePicture: url, profilePicturePublicId: publicId } },
        { returnDocument: 'after' },
      );

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: updateProfileImage',
        error,
      );
      return null;
    }
  }

  async removeProfileImage(email: string) {
    try {
      const data = await this.collection.findOneAndUpdate(
        { email },
        { $set: { profilePicture: null, profilePicturePublicId: null } },
        { returnDocument: 'after' },
      );

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: removeProfileImage',
        error,
      );
      return null;
    }
  }

  async toggleProfileImageVisibility(email: string) {
    try {
      const user = await this.collection.findOne({ email });
      if (!user) {
        console.log('User not found');
        return false;
      }

      const newVisibility = !user.hideProfilePicture;

      const data = await this.collection.findOneAndUpdate(
        { email },
        { $set: { hideProfilePicture: newVisibility } },
        { returnDocument: 'after' },
      );

      return data.hideProfilePicture;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: toggleProfileImageVisibility',
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
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
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

  async updateProfessionalExperience(
    email: string,
    details: any,
    recordId: string,
  ) {
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

  async toggleProfessionalExperienceVisibility(
    email: string,
    recordId: string,
  ) {
    try {
      const user = await this.collection.findOne({ email });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (
        !user.professionalExperience ||
        user.professionalExperience.length === 0
      ) {
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
        {
          $set: {
            'professionalExperience.$.hide': !professionalExperienceDetail.hide,
          },
        },
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

  async toggleSkillVisibility(
    email: string,
    recordId: string,
  ): Promise<Boolean> {
    try {
      const user = await this.collection.findOne({ email });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (!user.skills || user.skills.length === 0) {
        throw new HttpException('No Skills found', HttpStatus.NOT_FOUND);
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

  async toggleLanguageVisibility(
    email: string,
    recordId: string,
  ): Promise<Boolean> {
    try {
      const user = await this.collection.findOne({ email });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (!user.languages || user.languages.length === 0) {
        throw new HttpException('No Languages found', HttpStatus.NOT_FOUND);
      }

      const language = user.languages.find(
        (l) => l._id.toString() === recordId,
      );
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

  async toggleCertificateVisibility(
    email: string,
    recordId: string,
  ): Promise<Boolean> {
    try {
      const user = await this.collection.findOne({ email });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (!user.certificates || user.certificates.length === 0) {
        throw new HttpException('No Certificates found', HttpStatus.NOT_FOUND);
      }

      const certificate = user.certificates.find(
        (c) => c._id.toString() === recordId,
      );
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

  async deleteCertificate(
    email: string,
    recordId: string,
  ): Promise<User | null> {
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

  async addProject(email: string, details: any) {
    try {
      const data = await this.collection.findOneAndUpdate(
        { email },
        { $push: { projects: details } },
        { returnDocument: 'after' },
      );

      if (!data) {
        console.log('No record found with the given ID');
        return null;
      }

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: addProject',
        error,
      );
      return null;
    }
  }

  async updateProject(email: string, recordId: string, details: any) {
    try {
      const updateFields = {};
      for (const key in details) {
        updateFields[`projects.$.${key}`] = details[key];
      }

      const data = await this.collection.findOneAndUpdate(
        { email, 'projects._id': new ObjectId(recordId) },
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
        'Something went Wrong while performing Database Operation: updateProject',
        error,
      );
      return null;
    }
  }

  async toggleProjectVisibility(
    email: string,
    recordId: string,
  ): Promise<Boolean> {
    try {
      const user = await this.collection.findOne({ email });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (!user.projects || user.projects.length === 0) {
        throw new HttpException('No Projects found', HttpStatus.NOT_FOUND);
      }

      const project = user.projects.find((p) => p._id.toString() === recordId);
      if (!project) {
        throw new HttpException(
          'No Project found with the given ID',
          HttpStatus.NOT_FOUND,
        );
      }

      const newVisibility = !project.hide;

      const data = await this.collection.findOneAndUpdate(
        { email, 'projects._id': new ObjectId(recordId) },
        { $set: { 'projects.$.hide': newVisibility } },
        { returnDocument: 'after' },
      );

      if (!data) {
        console.log('No record found with the given ID');
        return null;
      }

      return data.projects.find((p) => p._id.toString() === recordId).hide;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: toggleProjectVisibility',
        error,
      );
      return null;
    }
  }

  async deleteProject(email: string, recordId: string): Promise<User | null> {
    try {
      const data = await this.collection.findOneAndUpdate(
        { email, 'projects._id': new ObjectId(recordId) },
        { $pull: { projects: { _id: new ObjectId(recordId) } } },
        { returnDocument: 'after' },
      );

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: deleteProject',
        error,
      );
      return null;
    }
  }

  async addAward(email: string, details: any) {
    try {
      const data = await this.collection.findOneAndUpdate(
        { email },
        { $push: { awards: details } },
        { returnDocument: 'after' },
      );

      if (!data) {
        console.log('No record found with the given ID');
        return null;
      }

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: addAward',
        error,
      );

      return null;
    }
  }

  async updateAward(email: string, recordId: string, details: any) {
    try {
      const updateFields = {};
      for (const key in details) {
        updateFields[`awards.$.${key}`] = details[key];
      }

      const data = await this.collection.findOneAndUpdate(
        { email, 'awards._id': new ObjectId(recordId) },
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
        'Something went Wrong while performing Database Operation: updateAward',
        error,
      );
      return null;
    }
  }

  async toggleAwardVisibility(
    email: string,
    recordId: string,
  ): Promise<Boolean> {
    try {
      const user = await this.collection.findOne({ email });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (!user.awards || user.awards.length === 0) {
        throw new HttpException('No Awards found', HttpStatus.NOT_FOUND);
      }

      const award = user.awards.find((a) => a._id.toString() === recordId);
      if (!award) {
        throw new HttpException(
          'No Award found with the given ID',
          HttpStatus.NOT_FOUND,
        );
      }

      const newVisibility = !award.hide;

      const data = await this.collection.findOneAndUpdate(
        { email, 'awards._id': new ObjectId(recordId) },
        { $set: { 'awards.$.hide': newVisibility } },
        { returnDocument: 'after' },
      );

      if (!data) {
        console.log('No record found with the given ID');
        return null;
      }

      return data.awards.find((a) => a._id.toString() === recordId).hide;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: toggleAwardVisibility',
        error,
      );
      return null;
    }
  }

  async deleteAward(email: string, recordId: string): Promise<User | null> {
    try {
      const data = await this.collection.findOneAndUpdate(
        { email, 'awards._id': new ObjectId(recordId) },
        { $pull: { awards: { _id: new ObjectId(recordId) } } },
        { returnDocument: 'after' },
      );

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: deleteAward',
        error,
      );
      return null;
    }
  }

  async addCourse(email: string, details: any) {
    try {
      const data = await this.collection.findOneAndUpdate(
        { email },
        { $push: { courses: details } },
        { returnDocument: 'after' },
      );

      if (!data) {
        console.log('No record found with the given ID');
        return null;
      }

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: addCourse',
        error,
      );
      return null;
    }
  }

  async updateCourse(email: string, recordId: string, details: any) {
    try {
      const updateFields = {};
      for (const key in details) {
        updateFields[`courses.$.${key}`] = details[key];
      }

      const data = await this.collection.findOneAndUpdate(
        { email, 'courses._id': new ObjectId(recordId) },
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
        'Something went Wrong while performing Database Operation: updateCourse',
        error,
      );
      return null;
    }
  }

  async toggleCourseVisibility(
    email: string,
    recordId: string,
  ): Promise<Boolean> {
    try {
      const user = await this.collection.findOne({ email });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (!user.courses || user.courses.length === 0) {
        throw new HttpException('No Courses found', HttpStatus.NOT_FOUND);
      }

      const course = user.courses.find((c) => c._id.toString() === recordId);
      if (!course) {
        throw new HttpException(
          'No Course found with the given ID',
          HttpStatus.NOT_FOUND,
        );
      }

      const newVisibility = !course.hide;

      const data = await this.collection.findOneAndUpdate(
        { email, 'courses._id': new ObjectId(recordId) },
        { $set: { 'courses.$.hide': newVisibility } },
        { returnDocument: 'after' },
      );

      if (!data) {
        console.log('No record found with the given ID');
        return null;
      }

      return data.courses.find((c) => c._id.toString() === recordId).hide;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: toggleCourseVisibility',
        error,
      );
      return null;
    }
  }

  async deleteCourse(email: string, recordId: string): Promise<User | null> {
    try {
      const data = await this.collection.findOneAndUpdate(
        { email, 'courses._id': new ObjectId(recordId) },
        { $pull: { courses: { _id: new ObjectId(recordId) } } },
        { returnDocument: 'after' },
      );

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: deleteCourse',
        error,
      );
      return null;
    }
  }

  async addOrganization(email: string, details: any) {
    try {
      const data = await this.collection.findOneAndUpdate(
        { email },
        { $push: { organizations: details } },
        { returnDocument: 'after' },
      );

      if (!data) {
        console.log('No record found with the given ID');
        return null;
      }

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: addOrganization',
        error,
      );
      return null;
    }
  }

  async updateOrganization(email: string, recordId: string, details: any) {
    try {
      const updateFields = {};
      for (const key in details) {
        updateFields[`organizations.$.${key}`] = details[key];
      }

      const data = await this.collection.findOneAndUpdate(
        { email, 'organizations._id': new ObjectId(recordId) },
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
        'Something went Wrong while performing Database Operation: updateOrganization',
        error,
      );
      return null;
    }
  }

  async toggleOrganizationVisibility(
    email: string,
    recordId: string,
  ): Promise<Boolean> {
    try {
      const user = await this.collection.findOne({ email });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (!user.organizations || user.organizations.length === 0) {
        throw new HttpException('No Organizations found', HttpStatus.NOT_FOUND);
      }

      const organization = user.organizations.find(
        (o) => o._id.toString() === recordId,
      );
      if (!organization) {
        throw new HttpException(
          'No Organization found with the given ID',
          HttpStatus.NOT_FOUND,
        );
      }

      const newVisibility = !organization.hide;

      const data = await this.collection.findOneAndUpdate(
        { email, 'organizations._id': new ObjectId(recordId) },
        { $set: { 'organizations.$.hide': newVisibility } },
        { returnDocument: 'after' },
      );

      if (!data) {
        console.log('No record found with the given ID');
        return null;
      }

      return data.organizations.find((o) => o._id.toString() === recordId).hide;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: toggleOrganizationVisibility',
        error,
      );
      return null;
    }
  }

  async deleteOrganization(
    email: string,
    recordId: string,
  ): Promise<User | null> {
    try {
      const data = await this.collection.findOneAndUpdate(
        { email, 'organizations._id': new ObjectId(recordId) },
        { $pull: { organizations: { _id: new ObjectId(recordId) } } },
        { returnDocument: 'after' },
      );

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: deleteOrganization',
        error,
      );
      return null;
    }
  }

  async addPublication(email: string, details: any) {
    try {
      const data = await this.collection.findOneAndUpdate(
        { email },
        { $push: { publications: details } },
        { returnDocument: 'after' },
      );

      if (!data) {
        console.log('No record found with the given ID');
        return null;
      }

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: addPublication',
        error,
      );
      return null;
    }
  }

  async updatePublication(email: string, recordId: string, details: any) {
    try {
      const updateFields = {};
      for (const key in details) {
        updateFields[`publications.$.${key}`] = details[key];
      }

      const data = await this.collection.findOneAndUpdate(
        { email, 'publications._id': new ObjectId(recordId) },
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
        'Something went Wrong while performing Database Operation: updatePublication',
        error,
      );
      return null;
    }
  }

  async togglePublicationVisibility(
    email: string,
    recordId: string,
  ): Promise<Boolean> {
    try {
      const user = await this.collection.findOne({ email });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (!user.publications || user.publications.length === 0) {
        throw new HttpException('No Publications found', HttpStatus.NOT_FOUND);
      }

      const publication = user.publications.find(
        (p) => p._id.toString() === recordId,
      );
      if (!publication) {
        throw new HttpException(
          'No Publication found with the given ID',
          HttpStatus.NOT_FOUND,
        );
      }

      const newVisibility = !publication.hide;

      const data = await this.collection.findOneAndUpdate(
        { email, 'publications._id': new ObjectId(recordId) },
        { $set: { 'publications.$.hide': newVisibility } },
        { returnDocument: 'after' },
      );

      if (!data) {
        console.log('No record found with the given ID');
        return null;
      }

      return data.publications.find((p) => p._id.toString() === recordId).hide;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: togglePublicationVisibility',
        error,
      );
      return null;
    }
  }

  async deletePublication(
    email: string,
    recordId: string,
  ): Promise<User | null> {
    try {
      const data = await this.collection.findOneAndUpdate(
        { email, 'publications._id': new ObjectId(recordId) },
        { $pull: { publications: { _id: new ObjectId(recordId) } } },
        { returnDocument: 'after' },
      );

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: deletePublication',
        error,
      );
      return null;
    }
  }

  async addReference(email: string, details: any) {
    try {
      const data = await this.collection.findOneAndUpdate(
        { email },
        { $push: { references: details } },
        { returnDocument: 'after' },
      );

      if (!data) {
        console.log('No record found with the given ID');
        return null;
      }

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: addReference',
        error,
      );
      return null;
    }
  }

  async updateReference(email: string, recordId: string, details: any) {
    try {
      const updateFields = {};
      for (const key in details) {
        updateFields[`references.$.${key}`] = details[key];
      }

      const data = await this.collection.findOneAndUpdate(
        { email, 'references._id': new ObjectId(recordId) },
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
        'Something went Wrong while performing Database Operation: updateReference',
        error,
      );
      return null;
    }
  }

  async toggleReferenceVisibility(
    email: string,
    recordId: string,
  ): Promise<Boolean> {
    try {
      const user = await this.collection.findOne({ email });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (!user.references || user.references.length === 0) {
        throw new HttpException('No References found', HttpStatus.NOT_FOUND);
      }

      const reference = user.references.find(
        (r) => r._id.toString() === recordId,
      );
      if (!reference) {
        throw new HttpException(
          'No Reference found with the given ID',
          HttpStatus.NOT_FOUND,
        );
      }

      const newVisibility = !reference.hide;

      const data = await this.collection.findOneAndUpdate(
        { email, 'references._id': new ObjectId(recordId) },
        { $set: { 'references.$.hide': newVisibility } },
        { returnDocument: 'after' },
      );

      if (!data) {
        console.log('No record found with the given ID');
        return null;
      }

      return data.references.find((r) => r._id.toString() === recordId).hide;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: toggleReferenceVisibility',
        error,
      );
      return null;
    }
  }

  async deleteReference(email: string, recordId: string): Promise<User | null> {
    try {
      const data = await this.collection.findOneAndUpdate(
        { email, 'references._id': new ObjectId(recordId) },
        { $pull: { references: { _id: new ObjectId(recordId) } } },
        { returnDocument: 'after' },
      );

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: deleteReference',
        error,
      );
      return null;
    }
  }

  async addDeclaration(email: string, details: any) {
    try {
      const data = await this.collection.findOneAndUpdate(
        { email },
        { $set: { 'declaration.text': details.text } },
        { returnDocument: 'after' },
      );

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: addDeclaration',
        error,
      );
      return null;
    }
  }

  async updateDeclaration(email: string, details: any) {
    try {
      // only update the fields that are passed in the details object if not passed then keep the existing value
      const updateFields = {};
      for (const key in details) {
        if (details[key] !== undefined) {
          updateFields[`declaration.${key}`] = details[key];
        }
      }

      const data = await this.collection.findOneAndUpdate(
        { email },
        { $set: updateFields },
        { returnDocument: 'after' },
      );

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: updateDeclaration',
        error,
      );
      return null;
    }
  }

  async toggleDeclarationVisibility(email: string): Promise<Boolean> {
    try {
      const user = await this.collection.findOne({ email });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (!user.declaration) {
        throw new HttpException('No Declaration found', HttpStatus.NOT_FOUND);
      }

      const newVisibility = !user.declaration.hide;

      const data = await this.collection.findOneAndUpdate(
        { email },
        { $set: { 'declaration.hide': newVisibility } },
        { returnDocument: 'after' },
      );

      if (!data) {
        console.log('No record found with the given ID');
        return null;
      }

      return data.declaration.hide;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: toggleDeclarationVisibility',
        error,
      );
      return null;
    }
  }

  async updateDeclarationSignature(
    email: string,
    url: string,
    publicId: string,
  ) {
    try {
      const data = await this.collection.findOneAndUpdate(
        { email },
        {
          $set: {
            'declaration.signature': url,
            'declaration.signaturePublicId': publicId,
          },
        },
        { returnDocument: 'after' },
      );

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: updateDeclarationSignature',
        error,
      );
      return null;
    }
  }

  async removeDeclarationSignature(email: string) {
    try {
      const data = await this.collection.findOneAndUpdate(
        { email },
        {
          $set: {
            'declaration.signature': null,
            'declaration.signaturePublicId': null,
          },
        },
        { returnDocument: 'after' },
      );

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: removeDeclarationSignature',
        error,
      );
      return null;
    }
  }
}
