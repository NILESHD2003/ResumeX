import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {ResumeStoreRepository} from "../repository/resumeStore.repository";
import {UserRepository} from "../repository/user.repository";

@Injectable()
export class StoreService {
    constructor(private readonly resumeStoreRepository: ResumeStoreRepository, private readonly userRepository: UserRepository) {
    }

    async getAllResumes(userEmail: string) {
        const user = await this.userRepository.findUserByEmail(userEmail);

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const res = await this.resumeStoreRepository.findResumeByUserId(user._id.toString());

        return {
            success: true,
            message: 'Resumes fetched successfully',
            data: res
        }
    }

    async getResumeById(resumeId: string) {
        const res = await this.resumeStoreRepository.findResumeById(resumeId);

        if(!res) {
            throw new HttpException('Resume not found', HttpStatus.NOT_FOUND);
        }

        return {
            success: true,
            message: 'Resume fetched successfully',
            data: res
        }
    }
}
