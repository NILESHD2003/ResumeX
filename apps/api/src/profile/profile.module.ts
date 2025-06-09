import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { Education_ProfileService, ProfileService, Professional_ProfileService, Skill_ProfileService, Language_ProfileService, Certificate_ProfileService, Project_ProfileService, Award_ProfileService, Course_ProfileService, Organization_ProfileService, Publication_ProfileService, Reference_ProfileService, Declaration_ProfileService } from './profile.service';
import { AuthModule } from 'src/auth/auth.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [AuthModule, CloudinaryModule],
  controllers: [ProfileController],
  providers: [ProfileService, Education_ProfileService, Professional_ProfileService, Skill_ProfileService, Language_ProfileService, Certificate_ProfileService, Project_ProfileService, Award_ProfileService, Course_ProfileService, Organization_ProfileService, Publication_ProfileService, Reference_ProfileService, Declaration_ProfileService]
})
export class ProfileModule {}
