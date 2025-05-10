import { Body, Controller, Post } from '@nestjs/common';
import { AgentService } from './agent.service';
import { NewJobDto } from './dto/job.dto';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post('ai/job')
  addNewJob(@Body() body: NewJobDto) {
    return this.agentService.addNewJob(body);
  }
}
