import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { ActivationAccountDto } from './dto/activation-account-dto';
import { SendForgotPasswordDto } from './dto/forgot-password-send.dto';
import { ConfirmForgotPasswordDto } from './dto/forgot-password-confirm.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RequestJwt } from 'src/core/interfaces/request-jwt.interface';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOTPDto } from './dto/resend-otp.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @Post('register')
    register(@Body() registerUserDto: RegisterUserDto){
        return this.authService.register(registerUserDto);
    }

    @Post('login')
    login(@Body() loginUserDto: LoginUserDto){
        return this.authService.login(loginUserDto);
    }

    @Get('profile')
    @UseGuards(AuthGuard)
    profile(@Req() req){

        console.log(req.user)
        return 'profile';
    }

    @Post('activate/account')
    activateAccount(@Body() activationAccount: ActivationAccountDto){
        return this.authService.activationAccount(activationAccount);
    }

    @Post('forgot-password')
    forgotPasswordSend(@Body() sendForgotPasswordDto: SendForgotPasswordDto){
        return this.authService.sendForgotPassword(sendForgotPasswordDto);
    }

    @Post('forgot-password/confirm')
    forgotPasswordConfirm(@Body() comfirmForgotPassword: ConfirmForgotPasswordDto){
        return this.authService.confirmForgotPassword(comfirmForgotPassword);
    }

    @Post('refresh-token')
    refreshToken(@Body() refreshToken: RefreshTokenDto){
        return this.authService.refreshToken(refreshToken);
    }

    @Post('change-password')
    @UseGuards(AuthGuard)
    changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() request: RequestJwt){
        return this.authService.changePassword(changePasswordDto, request.user.idUser);
    }

    @Post('loginAdmin')
    loginAdmin(@Body() loginUserDto: LoginUserDto){
        return this.authService.loginAdmin(loginUserDto);
    }

    @Post('verifyOTP')
    verifyOPT(@Body() verifyOTP: VerifyOtpDto){
        return this.authService.verifyOTP(verifyOTP);
    }

    @Post('resendOTP')
    resendOTP(@Body() resendOTP: ResendOTPDto){
        return this.authService.resendOTP(resendOTP);
    }

    @Get('logout')
    @UseGuards(AuthGuard)
    logout(@Req() request: RequestJwt){
        return this.authService.logout(request.user.idUser);
    }

    @Post('delete/account')
    @UseGuards(AuthGuard)
    deleteAccount(@Req() request: RequestJwt, @Body() deleteAccountDto: DeleteAccountDto){
        return this.authService.deleteAccount(request.user.idUser, deleteAccountDto.password);
    }
}
