import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { OtherFunctionsService } from 'src/core/services/other-functions.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    OtherFunctionsService
  ],
  exports: [UsersService]
})
export class UsersModule {}
