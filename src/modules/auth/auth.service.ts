import { BadRequestException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { compare, genSalt, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { TokenActivation } from 'src/core/models/token.model';
import { Op } from 'sequelize';
import { User } from 'src/core/models/user.model';
import { ActivationAccountDto } from './dto/activation-account-dto';
import { SendForgotPasswordDto } from './dto/forgot-password-send.dto';
import { OtherFunctionsService } from 'src/core/services/other-functions.service';
import { ConfirmForgotPasswordDto } from './dto/forgot-password-confirm.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { v4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly otherFunctionService: OtherFunctionsService,
        private readonly configService: ConfigService
    ){}

    async register(registerUserDto: RegisterUserDto){

        const user = await User.findOne({
        where: {
            [Op.or]: [
            { email: registerUserDto.email },
            { phone: registerUserDto.phone }
            ]
        }
        });
    
        if(user) throw new BadRequestException("El correo o telefono ingresado ya existe");
    
        if(registerUserDto.password !== registerUserDto.re_password) throw new BadRequestException("Las contraseñas no coinciden");
    
        try {
    
            const newUser = await User.create({
                firstName: registerUserDto.first_name,
                lastName: registerUserDto.last_name,
                email: registerUserDto.email,
                phone: registerUserDto.phone,
                password: registerUserDto.password
            });

            const tokenEncrypted = await this.otherFunctionService.encryptedString();
        
            const newToken = await TokenActivation.create({
        
                token: tokenEncrypted,
                uuid: this.otherFunctionService.getUuidToken(),
                idUser: newUser.idUser
            });
        
            await this.otherFunctionService.sendEmail(newToken, newUser.email, "activationAcctount");
        
            return {
                message: "Usuario creado con exito",
                statusCode: HttpStatus.CREATED,
                data: newUser
            };
        } catch (error) {
            throw new BadRequestException("No se creo el usuario correctamente");
        }
    }

    async login(loginUserDto: LoginUserDto) {

        const user = await this.usersService.findEmailUser(loginUserDto.email);

        if(!user) throw new UnauthorizedException("El correo ingresado no existe");

        const passwordValid = await compare(loginUserDto.password, user.password);

        if(!passwordValid) throw new UnauthorizedException("La contraseña ingresada es incorrecta");
        if(!user.active) throw new UnauthorizedException("La cuenta no esta activada");

        user.last_login = new Date();
        await user.save();

        const payload = { email: user.email, idUser: user.idUser }
        const token = this.jwtService.sign(payload);

        return {

            message: "Autenticacion realizada con exito",
            statusCode: HttpStatus.OK,
            data: {
                email: user.email,
                first_name: user.firstName,
                last_name: user.lastName,
                token
            }
        };
    }

    async activationAccount(activationAccount: ActivationAccountDto): Promise<ResponseData>{

        const tokenActivate = await TokenActivation.findOne({

            where: {
                [Op.or]: [
                    { uuid: activationAccount.uuid },
                    { token: activationAccount.token }
                ]
            }
        });

        if(!tokenActivate) throw new NotFoundException("Token de activacion no encontrado");

        const timeNow = new Date().getTime();
        const timeDiff = timeNow - tokenActivate.time.getTime();
        const minutesDiff = timeDiff / (1000 * 60);

        if(!tokenActivate) throw new BadRequestException("Las credenciales no son validas");
        if(minutesDiff >= 30) throw new BadRequestException("El token a expirado");

        const user = await User.findByPk(tokenActivate.idUser);

        user.active = true;
        await user.save();
        await tokenActivate.destroy();

        return {
            message: "Se activo la cuenta con exito",
            statusCode: HttpStatus.OK
        }
    }

    async sendForgotPassword(sendForgotPasswordDto: SendForgotPasswordDto): Promise<ResponseData>{

        const user = await User.findOne({
            where: {
                email: sendForgotPasswordDto.email
            }
        });

        if(!user) throw new NotFoundException("El email ingresado no se encuentra registrado");

        const tokenEncrypted = await this.otherFunctionService.encryptedString();

        const newToken = await TokenActivation.create({
            token: tokenEncrypted,
            uuid: this.otherFunctionService.getUuidToken(),
            idUser: user.idUser
        });

        await this.otherFunctionService.sendEmail(newToken, sendForgotPasswordDto.email, "resetPassword");

        return {
            statusCode: HttpStatus.OK,
            message: "El correo se envio con exito"
        }
    }

    async confirmForgotPassword(comfirmForgotPasswordDto: ConfirmForgotPasswordDto): Promise<ResponseData>{
        

        const tokenActivation = await TokenActivation.findOne({

            where: {
                [Op.and]: [
                    { token: comfirmForgotPasswordDto.token },
                    { uuid: comfirmForgotPasswordDto.uuid }
                ]
            }
        });

        if(!tokenActivation) throw new BadRequestException("El token no es valido");
        if(comfirmForgotPasswordDto.password !== comfirmForgotPasswordDto.rePassword) throw new BadRequestException("Las contraseñas no coinciden");

        const genSaltNumber = await genSalt(10);
        const passwordEncrypt = await hash(comfirmForgotPasswordDto.password, genSaltNumber);

        await User.update({
            password: passwordEncrypt
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
}
