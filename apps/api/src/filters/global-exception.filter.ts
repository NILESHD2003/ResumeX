import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.getResponse();

      return response.status(status).json({
        success: false,
        path: request.url,
        message,
      });
    }

    // For unknown/unexpected errors
    this.logger.error('UNEXPECTED ERROR:', exception);

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      path: request.url,
      message: 'Internal Server Error. Please try again later.',
    });
  }
}
