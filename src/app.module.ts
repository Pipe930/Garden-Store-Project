import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigEnvironment } from './config/config.environment';
import { DatabaseModule } from './core/database/database.module';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UsersModule } from './modules/users/users.module';
import { envShema } from './config/env-shema';
import { AuthModule } from './modules/auth/auth.module';
import { AccessControlModule } from './modules/access-control/access-control.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development.local',
      isGlobal: true,
      load: [AppConfigEnvironment],
      validationSchema: envShema
    }),
    DatabaseModule,
    MorganModule,
    UsersModule,
    AuthModule,
    AccessControlModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor("combined"),
    }
  ]
})
export class AppModule {}
