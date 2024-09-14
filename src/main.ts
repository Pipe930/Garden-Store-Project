import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CORS } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api/v1.0");
  app.enableCors(CORS);

  const configService = app.get(ConfigService);
  await app.listen(parseInt(configService.get("port")));
  console.log(`Application running on: ${await app.getUrl()}`);
}
bootstrap();
