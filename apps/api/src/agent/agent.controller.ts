import {
  Body,
  Controller,
  Post,
  Query,
  Sse,
  UseGuards,
  Param,
  Get,
} from '@nestjs/common';
import { AgentService } from './agent.service';
import { NewJobDto } from './dto/job.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { SuccessResponseDto } from 'src/dto/common.dto';

@Controller('agent')
@UseGuards(JwtAuthGuard)
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post('ai/job')
  addNewJob(
    @GetUser() user,
    @Body() body: NewJobDto,
    @Query('method') method: string,
  ): Promise<SuccessResponseDto<{success: boolean, jobId: string, message: string}>> {
    if (method === 'jobLink') {
      return this.agentService.addNewJobByJobLink(body.jobLink, user.email);
    } else {
      return this.agentService.addNewJob(body.jobDescription, user.email);
    }
  }

  @Get('job/status/:jobId')
  getJobStatus(@Param('jobId') jobId: string) {
    return this.agentService.getJobStatus(jobId);
  }
}
