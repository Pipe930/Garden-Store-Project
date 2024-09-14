import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigEnvironment } from './config/config.environment';
import { DatabaseModule } from './core/database/database.module';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development.local',
      isGlobal: true,
      load: [AppConfigEnvironment]
    }),
    DatabaseModule,
    MorganModule,
    UsersModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor("combined"),
    }
  ]
})
export class AppModule {}
