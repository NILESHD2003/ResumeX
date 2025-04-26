import { Injectable } from '@nestjs/common';
import { Collection } from 'mongodb';
import { MongoService } from '../Mongo/mongo.service';
import { User, USER_COLLECTION } from '../Mongo/Schema/user.schema';
import {
  EmailValidationDto,
  PersonalDetailsDto,
} from 'src/profile/dto/profile.dto';

// try{

// }catch(error){
//   console.log("Something went Wrong while performing Database Operation: updateUserProfileSummary ", error);
// }

class educationDetails {}

@Injectable()
export class UserRepository {
  private collection: Collection<User>;

  constructor(private readonly mongo: MongoService) {}

  async onModuleInit() {
    const db = await this.mongo.getDb();
    this.collection = db.collection<User>(USER_COLLECTION);
  }

  async findUserByEmail(email: EmailValidationDto): Promise<User | null> {
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
    email: EmailValidationDto,
    password: string,
    name: string,
  ): Promise<Boolean> {
    try {
      const user = await this.collection.insertOne({
        name,
        email: email.toString(),
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
    email: EmailValidationDto,
    summary: string,
  ): Promise<String | null> {
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
      return user.profileSummary;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: updateUserProfileSummary ',
        error,
      );
      return null;
    }
  }

  async toggleProfileSummaryVisibility(
    email: EmailValidationDto,
  ): Promise<Boolean> {
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

  async findUserPersonalDetails(email: EmailValidationDto) {
    try {
      const data = await this.collection.findOne(
        {
          email,
        },
        {
          projection: {
            PersonalDetails: 1,
            _id: 0,
            email: 1,
            name: 1,
            profilePicture: 1,
            profileSummary: 1,
          },
        },
      );

      return data;
    } catch (error) {
      console.log(
        'Something went Wrong while performing Database Operation: findUserPersonalDetails',
        error,
      );
      return null;
    }
  }

  async updateUserPersonalDetails(
    email: EmailValidationDto,
    details: PersonalDetailsDto,
  ) {
    try {
      const data = await this.collection.findOneAndUpdate(
        { email },
        { $set: { PersonalDetails: details } },
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
}
