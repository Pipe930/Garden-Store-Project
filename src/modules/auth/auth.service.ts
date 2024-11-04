import { BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { RefreshToken, TokenActivation } from 'src/modules/users/models/token.model';
import { Op } from 'sequelize';
import { User } from '../users/models/user.model';
import { ActivationAccountDto } from './dto/activation-account-dto';
import { SendForgotPasswordDto } from './dto/forgot-password-send.dto';
import { ConfirmForgotPasswordDto } from './dto/forgot-password-confirm.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { PasswordService } from 'src/core/services/password.service';
import { SendEmailService } from 'src/core/services/send-email.service';
import { TokenService } from 'src/core/services/token.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Role, RoleUser } from '../access-control/models/rol.model';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Cart } from '../cart/models/cart.model';
import { UserOPTVerification } from '../users/models/userOPTVerification';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOTPDto } from './dto/resend-otp.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly passwordService: PasswordService,
        private readonly sendEmailService: SendEmailService,
        private readonly tokenService: TokenService
    ){}

    async register(registerUserDto: RegisterUserDto){

        const { firstName, lastName, email, phone, password, rePassword } = registerUserDto;

        await this.validateUser(email, phone);
        if(password !== rePassword) throw new BadRequestException("Las contraseñas no coinciden");

        const role = await Role.findOne<Role>({
            where: {
                name: "cliente"
            }
        })
    
        try {
    
            const newUser = await User.create<User>({
                firstName,
                lastName,
                email,
                phone,
                password: this.passwordService.passwordEncrypted(password)
            });

            await Cart.create({
                idCartUser: newUser.idUser
            })

            await RoleUser.create({
                idUser: newUser.idUser,
                idRole: role.idRole
            });

            const newToken = await TokenActivation.create<TokenActivation>({
                token: await this.tokenService.encryptedString(),
                uuid: this.tokenService.getUuidToken(),
                idUser: newUser.idUser
            });
        
            await this.sendEmailService.sendEmail(newToken, newUser.email, "activationAcctount");
        
            return {
                message: "Usuario creado con exito",
                statusCode: HttpStatus.CREATED,
                data: newUser
            };

        } catch (error) {
            throw new InternalServerErrorException("Error no se creo el usuario correctamente");
        }
    }

    async login(loginUserDto: LoginUserDto): Promise<ResponseData>{

        const { email, password } = loginUserDto;
        const user = await this.usersService.findEmailUser(email);

        if(!user || !this.passwordService.checkPassword(password, user.password)) throw new UnauthorizedException("Las credeciales no son validas");
        if(!user.active) throw new UnauthorizedException("La cuenta no esta activada");

        if(this.userRoleValid(user, "administrador")) return this.verifyOPTVerifyEmail(user);

        user.lastLogin = new Date();
        await user.save();

        return {

            message: "Autenticacion realizada con exito",
            statusCode: HttpStatus.OK,
            data: await this.tokenService.generateTokenJWT(user)
        };
    }

    async verifyOTP(verifyOTP: VerifyOtpDto): Promise<ResponseData>{
        
        const { otp, idUser } = verifyOTP;

        const OTPfind = await UserOPTVerification.findOne<UserOPTVerification>({
            where: {
                idUser
            }
        });

        if(!OTPfind) throw new NotFoundException("Este usuario no tiene un OTP");
        if(new Date().getTime() > OTPfind.expiresAt.getTime()) throw new BadRequestException("El OTP a expirado");
        if(!this.passwordService.checkPassword(otp, OTPfind.otp)) throw new BadRequestException("El OTP no es valido");

        await OTPfind.destroy();

        const user = await User.findByPk<User>(idUser, {
            include: [
                {
                    model: Role,
                    attributes: ["name"]
                }
            ]
        });

        user.lastLogin = new Date();
        await user.save();

        return {

            message: "Autenticacion realizada con exito",
            statusCode: HttpStatus.OK,
            data: await this.tokenService.generateTokenJWT(user)
        }
    }

    async resendOTP(resendOTP: ResendOTPDto): Promise<any>{

        const { idUser } = resendOTP;

        const OTPfind = await UserOPTVerification.findOne<UserOPTVerification>({
            where: {
                idUser
            }
        });

        if(!OTPfind) throw new NotFoundException("Este usuario no tiene un OTP");

        const user = await User.findByPk<User>(idUser);

        await OTPfind.destroy();

        return this.verifyOPTVerifyEmail(user);
    }

    async activationAccount(activationAccount: ActivationAccountDto): Promise<ResponseData>{

        const { uuid, token } = activationAccount;

        const tokenActivate = await TokenActivation.findOne<TokenActivation>({
            where: {
                [Op.and]: [
                    { uuid },
                    { token }
                ]
            }
        });

        if(!tokenActivate) throw new NotFoundException("Token de activacion no encontrado");

        const timeDiff = (new Date().getTime() - tokenActivate.time.getTime()) / (1000 * 60);

        if(timeDiff >= 30) throw new BadRequestException("El token a expirado");

        const user = await User.findByPk<User>(tokenActivate.idUser);

        user.active = true;
        await user.save();
        await tokenActivate.destroy();

        return {
            message: "Se activo la cuenta con exito",
            statusCode: HttpStatus.OK
        }
    }

    async sendForgotPassword(sendForgotPasswordDto: SendForgotPasswordDto): Promise<ResponseData>{

        const { email } = sendForgotPasswordDto;

        const user = await User.findOne({
            where: {
                email
            }
        });

        if(!user) throw new NotFoundException("El email ingresado no se encuentra registrado");

        try {     
            const newToken = await TokenActivation.create<TokenActivation>({
                token: await this.tokenService.encryptedString(),
                uuid: this.tokenService.getUuidToken(),
                idUser: user.idUser
            });
    
            await this.sendEmailService.sendEmail(newToken, email, "resetPassword");
        } catch (error) {
            throw new InternalServerErrorException("Error al enviar el correo");            
        }

        return {
            statusCode: HttpStatus.OK,
            message: "El correo se envio con exito"
        }
    }

    async confirmForgotPassword(comfirmForgotPasswordDto: ConfirmForgotPasswordDto): Promise<ResponseData>{

        const { token, uuid, newPassword, newRePassword } = comfirmForgotPasswordDto;

        const tokenActivation = await TokenActivation.findOne<TokenActivation>({

            where: {
                [Op.and]: [
                    { token },
                    { uuid }
                ]
            }
        });

        if(!tokenActivation) throw new BadRequestException("El token no es valido");
        if(newPassword !== newRePassword) throw new BadRequestException("Las contraseñas no coinciden");

        await User.update({
            password: this.passwordService.passwordEncrypted(newPassword)
        }, {
            where: {
                idUser: tokenActivation.idUser
            }
        });

        return {
            statusCode: HttpStatus.OK,
            message: "La contraseña se restablecio con exito"
        };
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<ResponseData>{

        const { refreshToken } = refreshTokenDto;

        const token = await RefreshToken.findOne<RefreshToken>({
            where: {
                token: refreshToken
            }
        });

        if(!token) throw new UnauthorizedException("El token no es valido");

        const user = await User.findOne<User>({
            where: {
                idUser: token.idRefreshToken
            },
            include: [
                {
                    model: Role
                }
            ]
        });

        return {
            statusCode: HttpStatus.OK,
            message: "Refresh token",
            data: await this.tokenService.generateTokenJWT(user)
        }
    }

    async changePassword(changePasswordDto: ChangePasswordDto, id: number): Promise<ResponseData>{

        const { oldPassword, newPassword, newRePassword } = changePasswordDto;

        const user = await User.findByPk<User>(id);

        if(!user) throw new NotFoundException("Usuario no encontrado");
        if(!this.passwordService.checkPassword(oldPassword, user.password)) throw new UnauthorizedException("La contraseña actual no es valida");
        if(newPassword !== newRePassword) throw new BadRequestException("Las contraseñas no coinciden");

        user.password = this.passwordService.passwordEncrypted(newPassword);
        await user.save();

        return {
            message: "Contraseña cambiada con exito",
            statusCode: HttpStatus.OK
        }
    }

    async logout(idUser: number): Promise<ResponseData>{

        const refreshToken = await RefreshToken.findOne<RefreshToken>({
            where: {
                idRefreshToken: idUser
            }
        });

        if(!refreshToken) throw new NotFoundException("Sesion no encontrada");

        await refreshToken.destroy();

        return {
            message: "Sesion cerrada con exito",
            statusCode: HttpStatus.OK
        }
    }

    async deleteAccount(idUser: number, password: string): Promise<ResponseData>{
            
        const user = await User.findByPk<User>(idUser);

        if(!user) throw new NotFoundException("Usuario no encontrado");
        if(!this.passwordService.checkPassword(password, user.password)) throw new UnauthorizedException("La contraseña no es valida");

        await user.destroy();

        return {
            message: "La cuenta a sido eliminada con exito",
            statusCode: HttpStatus.OK
        }
    }

    async profile(idUser: number): Promise<ResponseData>{

        const userProfile = await User.findByPk<User>(idUser, {
            attributes: [
                "firstName",
                "lastName",
                "email",
                "phone"
            ]
        });

        return {
            message: "Perfil de usuario",
            statusCode: HttpStatus.OK,
            data: userProfile
        }
    }

    async updateProfile(idUser: number, updateProfileDto: UpdateProfileDto): Promise<ResponseData>{

        const { firstName, lastName, email, phone } = updateProfileDto;

        const user = await User.findByPk<User>(idUser);

        await this.validateUser(email, phone);
        if(!user) throw new NotFoundException("Usuario no encontrado");

        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.phone = phone;

        await user.save();

        return {
            message: "Perfil actualizado con exito",
            statusCode: HttpStatus.OK
        }
    }

    async verifyOPTVerifyEmail(user: User): Promise<any>{

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashOtp = this.passwordService.passwordEncrypted(otp);

        const OTPfind = await UserOPTVerification.findByPk(user.idUser);

        if(OTPfind) throw new ConflictException("Ya se envio un correo con el OTP");

        try {            
            await UserOPTVerification.create<UserOPTVerification>({
                idUser: user.idUser,
                otp: hashOtp,
                expiresAt: Date.now() + 900000
            });
    
            await this.sendEmailService.sendEmailOTP(user.email, otp);    
        } catch (error) {
            throw new InternalServerErrorException("Error al enviar el correo");
        }
        return {
            message: "Correo enviado con exito",
            statusCode: HttpStatus.OK,
            data: {
                idUser: user.idUser,
                email: user.email
            }
        }
    }

    private userRoleValid(user: User, role: string): boolean{
        return user.rolesUser.some(roles => roles.name === role);
    }

    private async validateUser(email: string, phone: string): Promise<void>{

        const user = await User.findOne<User>({
            where: {
                [Op.or]: [
                    { email },
                    { phone }
                ]
            }
        });
        
        if(user) throw new ConflictException("El correo o telefono ingresado ya existe");
    }
}
