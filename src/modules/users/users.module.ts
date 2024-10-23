import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PasswordService } from 'src/core/services/password.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PasswordService
  ],
  exports: [UsersService]
})
export class UsersModule {}
