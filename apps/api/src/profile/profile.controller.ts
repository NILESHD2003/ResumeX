import {
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { ProfileService, Education_ProfileService, Professional_ProfileService, Skill_ProfileService, Language_ProfileService, Certificate_ProfileService, Project_ProfileService, Award_ProfileService, Course_ProfileService, Organization_ProfileService, Publication_ProfileService, Reference_ProfileService, Declaration_ProfileService } from './profile.service';
import {
  EducationDetailDto,
  EducationDetailResponseDto,
  PersonalDetailsDto,
  PersonalDetailsResponseDto,
  ProfessionalExperienceDto,
  ProfessionalExperienceResponseDto,
  ProfileSummaryRequestDto,
  SkillResponseDto,
  SkillDto,
  LanguageDto,
  LanguageResponseDto,
  CertificateDto,
  CertificateResponseDto,
  ProjectResponseDto,
  ProjectDto,
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
} from './dto/profile.dto';
import { SuccessResponseDto } from 'src/dto/common.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService, private readonly educationProfileService: Education_ProfileService, private readonly professionalProfileService: Professional_ProfileService, private readonly skillProfileService: Skill_ProfileService, private readonly languageProfileService: Language_ProfileService, private readonly certificateProfileService: Certificate_ProfileService, private readonly projectProfileService: Project_ProfileService, private readonly awardProfileService: Award_ProfileService, private readonly courseProfileService: Course_ProfileService, private readonly organizationProfileService: Organization_ProfileService, private readonly publicationProfileService: Publication_ProfileService, private readonly referenceProfileService: Reference_ProfileService, private readonly declarationProfileService: Declaration_ProfileService) {}

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

  @Get('image')
  getProfileImage(@GetUser() user): Promise<SuccessResponseDto<string>> {
    return this.profileService.getProfileImage(user.email);
  }

  @UseInterceptors(FileInterceptor('image'))
  @Patch('image')
  updateProfileImage(@GetUser() user, @UploadedFile() image: Express.Multer.File) {
    return this.profileService.updateProfileImage(user.email, image);
  }

  @Patch('image/toggle-visibility')
  toggleProfileImageVisibility(@GetUser() user): Promise<SuccessResponseDto<Boolean>> {
    return this.profileService.toggleProfileImageVisibility(user.email);
  }

  @Delete('image')
  removeProfileImage(@GetUser() user): Promise<SuccessResponseDto<string>> {
    return this.profileService.removeProfileImage(user.email);
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
  updateProfessionalExperience(@GetUser() user, @Body() body: ProfessionalExperienceDto, @Param('recordId') recordId: string): Promise<SuccessResponseDto<ProfessionalExperienceResponseDto>> {
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
  getSkills(@GetUser() user): Promise<SuccessResponseDto<SkillResponseDto[]>> {
    return this.skillProfileService.getSkills(user.email);
  }

  @Post('skills')
  addSkill(@GetUser() user, @Body() body: SkillDto): Promise<SuccessResponseDto<SkillResponseDto>> {
    return this.skillProfileService.addSkill(user.email, body);
  }

  @Patch('skills/:recordId')
  updateSkill(@GetUser() user, @Body() body: any, @Param('recordId') recordId: string): Promise<SuccessResponseDto<SkillResponseDto>> {
    return this.skillProfileService.updateSkill(user.email, recordId, body);
  }

  @Patch('skills/:recordId/toggle-visibility')
  toggleSkillVisibility(@GetUser() user, @Param('recordId') recordId: string): Promise<SuccessResponseDto<Boolean>> {
    return this.skillProfileService.toggleSkillVisibility(user.email, recordId);
  }

  @Delete('skills/:recordId')
  removeSkill(@GetUser() user, @Param('recordId') recordId: string): Promise<SuccessResponseDto<SkillResponseDto[]>> {
    return this.skillProfileService.deleteSkill(user.email, recordId);
  }

  @Get('languages')
  getLanguages(@GetUser() user): Promise<SuccessResponseDto<LanguageResponseDto[]>> {
    return this.languageProfileService.getLanguages(user.email);
  }

  @Post('languages')
  addLanguage(@GetUser() user, @Body() body: LanguageDto): Promise<SuccessResponseDto<LanguageResponseDto>> {
    return this.languageProfileService.addLanguage(user.email, body);
  }

  @Patch('languages/:recordId')
  updateLanguage(@GetUser() user, @Body() body: any, @Param('recordId') recordId: string): Promise<SuccessResponseDto<LanguageResponseDto>> {
    return this.languageProfileService.updateLanguage(user.email, recordId, body);
  }

  @Patch('languages/:recordId/toggle-visibility')
  toggleLanguageVisibility(@GetUser() user, @Param('recordId') recordId: string): Promise<SuccessResponseDto<Boolean>> {
    return this.languageProfileService.toggleLanguageVisibility(user.email, recordId);
  }

  @Delete('languages/:recordId')
  removeLanguage(@GetUser() user, @Param('recordId') recordId: string): Promise<SuccessResponseDto<LanguageResponseDto[]>> {
    return this.languageProfileService.deleteLanguage(user.email, recordId);
  }

  @Get('certificates')
  getCertificates(@GetUser() user): Promise<SuccessResponseDto<CertificateResponseDto[]>> {
    return this.certificateProfileService.getCertificates(user.email);
  }

  @Post('certificates')
  addCertificate(@GetUser() user, @Body() body: CertificateDto): Promise<SuccessResponseDto<CertificateResponseDto>> {
    return this.certificateProfileService.addCertificate(user.email, body);
  }

  @Patch('certificates/:recordId')
  updateCertificate(@GetUser() user, @Body() body: any, @Param('recordId') recordId: string): Promise<SuccessResponseDto<CertificateResponseDto>> {
    return this.certificateProfileService.updateCertificate(user.email, recordId, body);
  }

  @Patch('certificates/:recordId/toggle-visibility')
  toggleCertificateVisibility(@GetUser() user, @Param('recordId') recordId: string): Promise<SuccessResponseDto<Boolean>> {
    return this.certificateProfileService.toggleCertificateVisibility(user.email, recordId);
  }

  @Delete('certificates/:recordId')
  removeCertificate(@GetUser() user, @Param('recordId') recordId: string): Promise<SuccessResponseDto<CertificateResponseDto[]>> {
    return this.certificateProfileService.deleteCertificate(user.email, recordId);
  }

  @Get('projects')
  getProjects(@GetUser() user): Promise<SuccessResponseDto<ProjectResponseDto[]>> {
    return this.projectProfileService.getProjects(user.email);
  }

  @Post('projects')
  addProject(@GetUser() user, @Body() body: ProjectDto): Promise<SuccessResponseDto<ProjectResponseDto>> {
    return this.projectProfileService.addProject(user.email, body);
  }

  @Patch('projects/:recordId')
  updateProject(@GetUser() user, @Body() body: any, @Param('recordId') recordId: string): Promise<SuccessResponseDto<ProjectResponseDto>> {
    return this.projectProfileService.updateProject(user.email, recordId, body);
  }

  @Patch('projects/:recordId/toggle-visibility')
  toggleProjectVisibility(@GetUser() user, @Param('recordId') recordId: string): Promise<SuccessResponseDto<Boolean>> {
    return this.projectProfileService.toggleProjectVisibility(user.email, recordId);
  }

  @Delete('projects/:recordId')
  removeProject(@GetUser() user, @Param('recordId') recordId: string): Promise<SuccessResponseDto<ProjectResponseDto[]>> {
    return this.projectProfileService.deleteProject(user.email, recordId);
  }

  @Get('awards')
  getAwards(@GetUser() user): Promise<SuccessResponseDto<AwardResponseDto[]>> {
    return this.awardProfileService.getAwards(user.email);
  }

  @Post('awards')
  addAward(@GetUser() user, @Body() body: AwardDto): Promise<SuccessResponseDto<AwardResponseDto>> {
    return this.awardProfileService.addAward(user.email, body);
  }

  @Patch('awards/:recordId')
  updateAward(@GetUser() user, @Body() body: any, @Param('recordId') recordId: string): Promise<SuccessResponseDto<AwardResponseDto>> {
    return this.awardProfileService.updateAward(user.email, recordId, body);
  }

  @Patch('awards/:recordId/toggle-visibility')
  toggleAwardVisibility(@GetUser() user, @Param('recordId') recordId: string): Promise<SuccessResponseDto<Boolean>> {
    return this.awardProfileService.toggleAwardVisibility(user.email, recordId);
  }

  @Delete('awards/:recordId')
  removeAward(@GetUser() user, @Param('recordId') recordId: string): Promise<SuccessResponseDto<AwardResponseDto[]>> {
    return this.awardProfileService.deleteAward(user.email, recordId);
  }

  @Get('courses')
  getCourses(@GetUser() user): Promise<SuccessResponseDto<CourseResponseDto[]>> {
    return this.courseProfileService.getCourses(user.email);
  }

  @Post('courses')
  addCourse(@GetUser() user, @Body() body: CourseDto): Promise<SuccessResponseDto<CourseResponseDto>> {
    return this.courseProfileService.addCourse(user.email, body);
  }

  @Patch('courses/:recordId')
  updateCourse(@GetUser() user, @Body() body: any, @Param('recordId') recordId: string): Promise<SuccessResponseDto<CourseResponseDto>> {
    return this.courseProfileService.updateCourse(user.email, recordId, body);
  }

  @Patch('courses/:recordId/toggle-visibility')
  toggleCourseVisibility(@GetUser() user, @Param('recordId') recordId: string): Promise<SuccessResponseDto<Boolean>> {
    return this.courseProfileService.toggleCourseVisibility(user.email, recordId);
  }

  @Delete('courses/:recordId')
  removeCourse(@GetUser() user, @Param('recordId') recordId: string): Promise<SuccessResponseDto<CourseResponseDto[]>> {
    return this.courseProfileService.deleteCourse(user.email, recordId);
  }

  @Get('organizations')
  getOrganizations(@GetUser() user): Promise<SuccessResponseDto<OrganizationResponseDto[]>> {
    return this.organizationProfileService.getOrganizations(user.email);
  }

  @Post('organizations')
  addOrganization(@GetUser() user, @Body() body: OrganizationDto): Promise<SuccessResponseDto<OrganizationResponseDto>> {
    return this.organizationProfileService.addOrganization(user.email, body);
  }

  @Patch('organizations/:recordId')
  updateOrganization(@GetUser() user, @Body() body: any, @Param('recordId') recordId: string): Promise<SuccessResponseDto<OrganizationResponseDto>> {
    return this.organizationProfileService.updateOrganization(user.email, recordId, body);
  }

  @Patch('organizations/:recordId/toggle-visibility')
  toggleOrganizationVisibility(@GetUser() user, @Param('recordId') recordId: string): Promise<SuccessResponseDto<Boolean>> {
    return this.organizationProfileService.toggleOrganizationVisibility(user.email, recordId);
  }

  @Delete('organizations/:recordId')
  removeOrganization(@GetUser() user, @Param('recordId') recordId: string): Promise<SuccessResponseDto<OrganizationResponseDto[]>> {
    return this.organizationProfileService.deleteOrganization(user.email, recordId);
  }

  @Get('publications')
  getPublications(@GetUser() user): Promise<SuccessResponseDto<PublicationResponseDto[]>> {
    return this.publicationProfileService.getPublications(user.email);
  }

  @Post('publications')
  addPublication(@GetUser() user, @Body() body: PublicationDto): Promise<SuccessResponseDto<PublicationResponseDto>> {
    return this.publicationProfileService.addPublication(user.email, body);
  }

  @Patch('publications/:recordId')
  updatePublication(@GetUser() user, @Body() body: any, @Param('recordId') recordId: string): Promise<SuccessResponseDto<PublicationResponseDto>> {
    return this.publicationProfileService.updatePublication(user.email, recordId, body);
  }

  @Patch('publications/:recordId/toggle-visibility')
  togglePublicationVisibility(@GetUser() user, @Param('recordId') recordId: string): Promise<SuccessResponseDto<Boolean>> {
    return this.publicationProfileService.togglePublicationVisibility(user.email, recordId);
  }

  @Delete('publications/:recordId')
  removePublication(@GetUser() user, @Param('recordId') recordId: string): Promise<SuccessResponseDto<PublicationResponseDto[]>> {
    return this.publicationProfileService.deletePublication(user.email, recordId);
  }

  @Get('references')
  getReferences(@GetUser() user): Promise<SuccessResponseDto<ReferenceResponseDto[]>> {
    return this.referenceProfileService.getReferences(user.email);
  }

  @Post('references')
  addReferences(@GetUser() user, @Body() body: ReferenceDto): Promise<SuccessResponseDto<ReferenceResponseDto>> {
    return this.referenceProfileService.addReference(user.email, body);
  }

  @Patch('references/:recordId')
  updateReferences(@GetUser() user, @Body() body: any, @Param('recordId') recordId: string): Promise<SuccessResponseDto<ReferenceResponseDto>> {
    return this.referenceProfileService.updateReference(user.email, recordId, body);
  }

  @Patch('references/:recordId/toggle-visibility')
  toggleReferenceVisibility(@GetUser() user, @Param('recordId') recordId: string): Promise<SuccessResponseDto<Boolean>> {
    return this.referenceProfileService.toggleReferenceVisibility(user.email, recordId);
  }

  @Delete('references/:recordId')
  removeReferences(@GetUser() user, @Param('recordId') recordId: string): Promise<SuccessResponseDto<ReferenceResponseDto[]>> {
    return this.referenceProfileService.deleteReference(user.email, recordId);
  }

  @Get('declaration')
  getDeclaration(@GetUser() user): Promise<SuccessResponseDto<DeclarationResponseDto>> {
    return this.declarationProfileService.getDeclaration(user.email);
  }

  @Patch('declaration')
  updateDeclaration(@GetUser() user, @Body() body: DeclarationDto): Promise<SuccessResponseDto<DeclarationResponseDto>> {
    return this.declarationProfileService.updateDeclaration(user.email, body);
  }

  @Patch('declaration/toggle-visibility')
  toggleDeclarationVisibility(@GetUser() user): Promise<SuccessResponseDto<Boolean>> {
    return this.declarationProfileService.toggleDeclarationVisibility(user.email);
  }


  @Get('declaration/signature')
  getDeclarationSignature(@GetUser() user): Promise<SuccessResponseDto<string>> {
    return this.declarationProfileService.getDeclarationSignature(user.email);
  }

  @Patch('declaration/signature')
  @UseInterceptors(FileInterceptor('signature'))
  updateDeclarationSignature(
    @GetUser() user,
    @UploadedFile() signature: Express.Multer.File,
  ): Promise<SuccessResponseDto<{ url: string; publicId: string }>> {
    return this.declarationProfileService.updateDeclarationSignature(user.email, signature);
  }

  @Delete('declaration/signature')
  removeDeclarationSignature(@GetUser() user): Promise<SuccessResponseDto<string>> {
    return this.declarationProfileService.removeDeclarationSignature(user.email);
  }
}
