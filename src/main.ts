import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'body-parser';
import { InsertDataService } from './core/services/insert-data.service';
import { CORS } from './config/cors.config';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const inserDataService = app.get(InsertDataService);
  const configService = app.get(ConfigService);
  
  app.use(json({ limit: '5mb' }));
  app.setGlobalPrefix("api/v1.0");
  app.enableCors(CORS);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));

  await inserDataService.insertDataLocates();
  await inserDataService.insertDataCategories();
  await inserDataService.insertDataAccessControl();
  await inserDataService.createSuperUser();
  await inserDataService.insertTags();

  await app.listen(parseInt(configService.get("port")));
  console.log(`Application running on: ${await app.getUrl()}`);
}
bootstrap();
