import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { ActivationAccountDto } from './dto/activation-account-dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @Post("login")
    login(@Body() loginUserDto: LoginUserDto){

        return this.authService.login(loginUserDto);
    }

    @Get("profile")
    @UseGuards(AuthGuard)
    profile(@Req() req){

        console.log(req.user)
        return "profile";
    }

    @Post("activate/account")
    activateAccount(@Body() activationAccount: ActivationAccountDto){
        return this.authService.activationAccount(activationAccount);
    }
}
