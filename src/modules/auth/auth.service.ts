import { BadRequestException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { TokenActivation } from 'src/core/models/token.model';
import { Op } from 'sequelize';
import { User } from 'src/core/models/user.model';
import { ActivationAccountDto } from './dto/activation-account-dto';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ){}

    async login(loginUserDto: LoginUserDto) {

        const user = await this.usersService.findEmailUser(loginUserDto.email);

        if(!user) throw new UnauthorizedException("El correo ingresado no existe");

        const passwordValid = await compare(loginUserDto.password, user.password);

        if(!passwordValid) throw new UnauthorizedException("La contraseña ingresada es incorrecta");
        if(!user.active) throw new UnauthorizedException("La cuenta no esta activada");

        user.last_login = new Date();
        await user.save();

        const payload = { email: user.email, id_user: user.id_user }
        const token = await this.jwtService.signAsync(payload);

        return {

            message: "Autenticacion realizada con exito",
            statusCode: HttpStatus.OK,
            data: {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
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

        const timeNow = new Date().getTime();
        const timeDiff = timeNow - tokenActivate.time.getTime();
        const minutesDiff = timeDiff / (1000 * 60);

        if(!tokenActivate) throw new BadRequestException("Las credenciales no son validas");
        if(minutesDiff >= 30) throw new BadRequestException("El token a expirado");

        const user = await User.findByPk(tokenActivate.id_token_user);

        user.active = true;
        await user.save();
        await tokenActivate.destroy();

        return {
            message: "Se activo la cuenta con exito",
            statusCode: HttpStatus.OK
        }
    }
}
