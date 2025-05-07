import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:4173', 'https://resumex-stage.netlify.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });
  const configService = app.get(ConfigService)
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
