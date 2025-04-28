import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { Education_ProfileService, ProfileService, Professional_ProfileService, Skill_ProfileService, Language_ProfileService, Certificate_ProfileService } from './profile.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ProfileController],
  providers: [ProfileService, Education_ProfileService, Professional_ProfileService, Skill_ProfileService, Language_ProfileService, Certificate_ProfileService]
})
export class ProfileModule {}
