import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import {StoreService} from "./store.service";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {GetUser} from "../auth/decorators/get-user.decorator";
import {SuccessResponseDto} from "../dto/common.dto";

@Controller('store')
@UseGuards(JwtAuthGuard)
export class StoreController {
    constructor(private readonly storeService: StoreService) {}

    @Get('resumes/all')
    getAllResumes(@GetUser() user): Promise<SuccessResponseDto<any>> {
        return this.storeService.getAllResumes(user.email);
    }

    @Get('resumes/:resumeId')
    getResumeById(@Param('resumeId') resumeId: string): Promise<SuccessResponseDto<any>> {
        return this.storeService.getResumeById(resumeId);
    }
}
