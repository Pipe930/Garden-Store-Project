import { BadRequestException, HttpStatus, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

        const user = await User.findOne<User>({
        where: {
            [Op.or]: [
                { email },
                { phone }
            ]
        }
        });
    
        if(user) throw new BadRequestException("El correo o telefono ingresado ya existe");
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

            console.log(error);
            throw new BadRequestException("No se creo el usuario correctamente");
        }
    }

    async login(loginUserDto: LoginUserDto) {

        const { email, password } = loginUserDto;
        const user = await this.usersService.findEmailUser(email);

        if(!user || !this.passwordService.checkPassword(password, user.password)) throw new UnauthorizedException("Las credeciales no son validas");
        if(!user.active) throw new UnauthorizedException("La cuenta no esta activada");

        user.lastLogin = new Date();
        await user.save();

        return {

            message: "Autenticacion realizada con exito",
            statusCode: HttpStatus.OK,
            data: await this.tokenService.generateTokenJWT(user)
        };
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

        const timeNow = new Date().getTime();
        const timeDiff = (timeNow - tokenActivate.time.getTime()) / (1000 * 60);

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

        const newToken = await TokenActivation.create<TokenActivation>({
            token: await this.tokenService.encryptedString(),
            uuid: this.tokenService.getUuidToken(),
            idUser: user.idUser
        });

        await this.sendEmailService.sendEmail(newToken, email, "resetPassword");

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
}
