import {
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { ProfileService, Education_ProfileService, Professional_ProfileService } from './profile.service';
import {
  EducationDetailDto,
  EducationDetailResponseDto,
  PersonalDetailsDto,
  PersonalDetailsResponseDto,
  ProfessionalExperienceDto,
  ProfessionalExperienceResponseDto,
  ProfileSummaryRequestDto,
} from './dto/profile.dto';
import { SuccessResponseDto } from 'src/dto/common.dto';

@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService, private readonly educationProfileService: Education_ProfileService, private readonly professionalProfileService: Professional_ProfileService) {}

  @Get('')
  getProfile(@GetUser() user): Promise<SuccessResponseDto<any>> {
    return this.profileService.getProfile(user.email);
  }

  @Get('summary')
  getProfileSummary(@GetUser() user): Promise<SuccessResponseDto<any>> {
    return this.profileService.getProfileSummary(user.email);
  }

  @Patch('summary')
  updateProfileSummary(
    @GetUser() user,
    @Body() body: ProfileSummaryRequestDto,
  ): Promise<SuccessResponseDto<any>> {
    return this.profileService.updateProfileSummary(user.email, body.summary);
  }

  @Patch('summary/toggle-visibility')
  toggleSummaryVisibility(@GetUser() user): Promise<SuccessResponseDto<Boolean>> {
    return this.profileService.toggleSummaryVisibility(user.email);
  }

  // TODO
  @Get('image')
  getProfileImage() {
    console.log('Get Profile Image');
    return;
  }

  // TODO
  @Patch('image')
  updateProfileImage() {
    console.log('Update Profile Image');
    return;
  }

  // TODO
  @Patch('image/toggle-visibility')
  toggleProfileImageVisibility() {
    console.log('Visibility Toggle');
    return;
  }

  @Get('personal-details')
  getPersonalDetails(@GetUser() user): Promise<SuccessResponseDto<PersonalDetailsResponseDto>> {
    return this.profileService.getPersonalDetails(user.email);
  }

  @Patch('personal-details')
  updatePersonalDetails(@GetUser() user, @Body() body: PersonalDetailsDto): Promise<SuccessResponseDto<PersonalDetailsResponseDto>> {
    return this.profileService.updatePersonalDetails(user.email, body);
  }

  @Get('education-details')
  getEducationDetails(@GetUser() user): Promise<SuccessResponseDto<EducationDetailResponseDto[]>> {
    return this.educationProfileService.getEducationDetails(user.email);
  }

  @Post('education-details')
  addEducationDetail(@GetUser() user, @Body() body: EducationDetailDto): Promise<SuccessResponseDto<EducationDetailResponseDto>> {
    return this.educationProfileService.addEducationDetail(user.email, body);
  }

  @Patch('education-details/:recordId')
  updateEducationDetails(@GetUser() user, @Body() body: any, @Param('recordId') recordId: string): Promise<SuccessResponseDto<EducationDetailResponseDto>> {
    return this.educationProfileService.updateEducationDetail(user.email, body, recordId);
  }

  @Patch('education-details/:recordId/toggle-visibility')
  toggleEducationDetailVisibility(@GetUser() user, @Param('recordId') recordId: string): Promise<SuccessResponseDto<Boolean>> {
    return this.educationProfileService.toggleEducationDetailVisibility(user.email, recordId);
  }

  @Delete('education-details/:recordId')
  removeEducationDetail(@GetUser() user, @Param('recordId') recordId: string): Promise<SuccessResponseDto<EducationDetailResponseDto[]>> {
    return this.educationProfileService.deleteEducationDetail(user.email, recordId);
  }

  @Get('professional-experiences')
  getProfessionalExperiences(@GetUser() user): Promise<SuccessResponseDto<ProfessionalExperienceResponseDto[]>> {
    return this.professionalProfileService.getProfessionalDetails(user.email);
  }

  @Post('professional-experiences')
  addProfessionalExperience(@GetUser() user, @Body() body: ProfessionalExperienceDto): Promise<SuccessResponseDto<ProfessionalExperienceResponseDto>> {
    return this.professionalProfileService.addProfessionalExperience(user.email, body);
  }

  @Patch('professional-experiences/:recordId')
  updateProfessionalExperience(@GetUser() user, @Body() body: any, @Param('recordId') recordId: string): Promise<SuccessResponseDto<ProfessionalExperienceResponseDto>> {
    return this.professionalProfileService.updateProfessionalExperience(user.email, body, recordId);
  }

  @Patch('professional-experiences/:recordId/toggle-visibility')
  toggleProfessionalExperienceVisibility(@GetUser() user, @Param('recordId') recordId: string): Promise<SuccessResponseDto<Boolean>> {
    return this.professionalProfileService.toggleProfessionalExperienceVisibility(user.email, recordId);
  }

  @Delete('professional-experiences/:recordId')
  removeProfessionalExperience(@GetUser() user, @Param('recordId') recordId: string): Promise<SuccessResponseDto<ProfessionalExperienceResponseDto[]>> {
    return this.professionalProfileService.deleteProfessionalExperience(user.email, recordId);
  }

  @Get('skills')
  getSkills() {
    console.log('Get Skill');
    return;
  }

  @Post('skills')
  addSkill() {
    console.log('Add Another Skills');
    return;
  }

  @Patch('skills/:recordId')
  updateSkill() {
    console.log('Update Skill');
    return;
  }

  @Patch('skills/:recordId/toggle-visibility')
  toggleSkillVisibility() {
    console.log('Visibility Toggle');
    return;
  }

  @Delete('skills/:recordId')
  removeSkill() {
    console.log('Delete Skill');
    return;
  }

  @Get('languages')
  getLanguages() {
    console.log('Get Languages');
    return;
  }

  @Post('languages')
  addLanguage() {
    console.log('Add Another Language');
    return;
  }

  @Patch('languages/:recordId')
  updateLanguage() {
    console.log('Update Language');
    return;
  }

  @Patch('languages/:recordId/toggle-visibility')
  toggleLanuageVisibility() {
    console.log('Visibility Toggle');
    return;
  }

  @Delete('languages/:recordId')
  removeLanguage() {
    console.log('Delete Langauge');
    return;
  }

  @Get('certificates')
  getCertificates() {
    console.log('Get Certificates');
    return;
  }

  @Post('certificates')
  addCertificate() {
    console.log('Add Another Certificate');
    return;
  }

  @Patch('certificates/:recordId')
  updateCertificate() {
    console.log('Update Certificate');
    return;
  }

  @Patch('certificate/:recordId/toggle-visibility')
  toggleCertificateVisibility() {
    console.log('Visibility Toggle');
    return;
  }

  @Delete('certificates/:recordId')
  removeCertificate() {
    console.log('Delete Certificate');
    return;
  }

  @Get('projects')
  getProjects() {
    console.log('Get Projects');
    return;
  }

  @Post('projects')
  addProject() {
    console.log('Add Another Project');
    return;
  }

  @Patch('projects/:recordId')
  updateProject() {
    console.log('Update Project');
    return;
  }

  @Patch('project/:recordId/toggle-visibility')
  toggleProjectVisibility() {
    console.log('Visibility Toggle');
    return;
  }

  @Delete('projects/:recordId')
  removeProject() {
    console.log('Delete Project');
    return;
  }

  @Get('awards')
  getAwards() {
    console.log('Get Awards');
    return;
  }

  @Post('awards')
  addAward() {
    console.log('Add Another Award');
    return;
  }

  @Patch('awards/:recordId')
  updateAward() {
    console.log('Update Award');
    return;
  }

  @Patch('awards/:recordId/toggle-visibility')
  toggleAwardVisibility() {
    console.log('Visibility Toggle');
    return;
  }

  @Delete('awards/:recordId')
  removeAward() {
    console.log('Delete Award');
    return;
  }

  @Get('courses')
  getCourses() {
    console.log('Get Courses');
    return;
  }

  @Post('courses')
  addCourse() {
    console.log('Add Another Course');
    return;
  }

  @Patch('courses/:recordId')
  updateCourse() {
    console.log('Update Course');
    return;
  }

  @Patch('courses/:recordId/toggle-visibility')
  toggleCourseVisibility() {
    console.log('Visibility Toggle');
    return;
  }

  @Delete('courses/:recordId')
  removeCourse() {
    console.log('Delete Course');
    return;
  }

  @Get('organizations')
  getOrganizations() {
    console.log('Get Organizations');
    return;
  }

  @Post('organizations')
  addOrganization() {
    console.log('Add Organization');
    return;
  }

  @Patch('organizations/:recordId')
  updateOrganization() {
    console.log('Update Organisation');
    return;
  }

  @Patch('organizations/:recordId/toggle-visibility')
  toggleOrganizationVisibility() {
    console.log('Visibility Toggle');
    return;
  }

  @Delete('organizations/:recordId')
  removeOrganization() {
    console.log('Remove Organization');
    return;
  }

  @Get('publications')
  getPublications() {
    console.log('Get All Publications');
    return;
  }

  @Post('publications')
  addPublication() {
    console.log('Added Publication');
    return;
  }

  @Patch('publications/:recordId')
  updatePublication() {
    console.log('Update Publication');
    return;
  }

  @Patch('publication/:recordId/toggle-visibility')
  togglePublicationVisibility() {
    console.log('Visibility Toggle');
    return;
  }

  @Delete('publications/:recordId')
  removePublication() {
    console.log('Remove Publication');
    return;
  }

  @Get('references')
  getReferences() {
    console.log('Get All References');
    return;
  }

  @Post('references')
  addReferences() {
    console.log('Add References');
    return;
  }

  @Patch('references/:recordId')
  updateReferences() {
    console.log('Update References');
    return;
  }

  @Patch('references/:recordId/toggle-visibility')
  toggleReferenceVisibility() {
    console.log('Visibility Toggle');
    return;
  }

  @Delete('references/:recordId')
  removeReferences() {
    console.log('Remove References');
    return;
  }

  @Get('declaration')
  getDeclaration() {
    console.log('Get Declaration');
    return;
  }

  @Patch('declaration')
  updateDeclaration() {
    console.log('Update Declaration');
    return;
  }

  @Patch('declaration/toggle-visibility')
  toggleDeclarationVisibility() {
    console.log('Visibility Toggle');
    return;
  }

  @Get('declaration/signature')
  getDeclarationSignature() {
    console.log('Get Declaration Signature');
    return;
  }

  @Patch('declaration/signature')
  updateDeclarationSignature() {
    console.log('Upload Declaration Signature');
    return;
  }

  @Delete('declaration/signature')
  removeDeclarationSignature() {
    console.log('Remove Declaration Signature');
    return;
  }
}
