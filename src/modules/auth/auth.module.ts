import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OtherFunctionsService } from 'src/core/services/other-functions.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('keyJwt'),
      }),
      inject: [ConfigService],
    }),
    JwtModule.register({
      global: true,
      signOptions: {  expiresIn: '30m' }
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    OtherFunctionsService
  ]
})
export class AuthModule {}
