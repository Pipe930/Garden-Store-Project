import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CORS } from './constants';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'body-parser';
import { InsertDataService } from './core/services/insert-data.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api/v1.0");
  app.enableCors(CORS);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }))

  app.use(json({ limit: '5mb' }));

  const inserDataService = app.get(InsertDataService);

  await inserDataService.insertDataLocates();
  await inserDataService.insertDataCategories();
  await inserDataService.insertDataAccessControl();

  const configService = app.get(ConfigService);
  await app.listen(parseInt(configService.get("port")));
  console.log(`Application running on: ${await app.getUrl()}`);
}
bootstrap();
