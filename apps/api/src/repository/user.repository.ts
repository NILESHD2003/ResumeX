import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Collection, ObjectId } from 'mongodb';
import { MongoService } from '../Mongo/mongo.service';
import { User, USER_COLLECTION } from '../Mongo/Schema/user.schema';
import {
  EducationDetailDto,
  PersonalDetailsDto,
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
}
