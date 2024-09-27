import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PasswordService } from 'src/core/services/password.service';
import { SendEmailService } from 'src/core/services/send-email.service';
import { TokenService } from 'src/core/services/token.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    SendEmailService,
    TokenService
  ]
})
export class AuthModule {}
