import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../../core/models/user.model';
import { Op } from 'sequelize';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { TokenActivation } from 'src/core/models/token.model';
import { v4 as uuidv4 } from "uuid";
import { readFileSync } from 'fs';
import { join } from 'path';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {

  private resend: Resend;

  constructor(private readonly configService: ConfigService){
    this.resend = new Resend(configService.get("apiKeyResend"));
  }

  private loadTemplate(templatePath: string, replacements: { [key: string]: string }): string {

    const template = readFileSync(templatePath, 'utf8');
    return Object.keys(replacements).reduce(
        (updatedTemplate, key) => updatedTemplate.replace(new RegExp(`{{${key}}}`, 'g'), replacements[key]),
        template
    );
  }

  private getUuidToken(): string {
    
    const listLetters = ['m', 'n', 'q', 'g', 'l', 'k'];
    let token = '';
  
    for (let i = 0; i < 2; i++) {

      const randomIndex = Math.floor(Math.random() * listLetters.length);
      let letter = listLetters[randomIndex];
  
      if (Math.random() > 0.5) {
        letter = letter.toUpperCase();
      }
  
      token += letter;
    }
  
    return token;
  }

  private async sendEmail(tokenActivation: TokenActivation, email: string){

    const templatePath = join(__dirname, '..', '..', 'templates', 'activateAccount.html');

    const htmlContent = this.loadTemplate(templatePath, {
      activation_link: `http://localhost:4200/activation/${tokenActivation.uuid}/${tokenActivation.token}`,
      privacy_policy_link: 'https://gardenstore.com/privacy',
      terms_link: 'https://gardenstore.com/terms'
    });

    try {
      const { data, error } = await this.resend.emails.send({
          from: "Acme <onboarding@resend.dev>",
          to: [email],
          subject: "Activacion de Cuenta",
          html: htmlContent,
      });

      if(error) throw new BadRequestException("El correo no se envio correctamente");

    } catch (error) {

        throw new BadRequestException('No se pudo enviar el correo de activación');
    }
  }

  async create(createUserDto: CreateUserDto): Promise<ResponseData> {
    
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: createUserDto.email },
          { phone: createUserDto.phone }
        ]
      }
    });

    if(user) throw new BadRequestException("El correo o telefono ingresado ya existe");

    if(createUserDto.password !== createUserDto.re_password) throw new BadRequestException("Las contraseñas no coinciden");

    try {

      const newUser = await User.create({
        first_name: createUserDto.first_name,
        last_name: createUserDto.last_name,
        email: createUserDto.email,
        phone: createUserDto.phone,
        password: createUserDto.password
      });

      const newToken = await TokenActivation.create({

        id_token_user: newUser.id_user,
        token: uuidv4(),
        uuid: this.getUuidToken()
      });

      await this.sendEmail(newToken, newUser.email);

      return {
        message: "Usuario creado con exito",
        statusCode: HttpStatus.CREATED,
        data: newUser
      };
    } catch (error) {

      console.log(error)
      throw new BadRequestException("No se creo el usuario correctamente");
    }
  }

  async findAll(): Promise<ResponseData> {

    const listUsers = await User.findAll();

    if(listUsers.length === 0) return { message: "No tenemos usuarios registrados", statusCode: HttpStatus.NO_CONTENT }

    return {

      statusCode: HttpStatus.OK,
      count: listUsers.length,
      data: listUsers
    };
  }

  async findEmailUser(email: string): Promise<User>{

    const user = await User.findOne({

      where: {
        email
      }
    })

    return user;
  }

  async findOne(id: number): Promise<ResponseData> {

    const user = await User.findByPk(id);

    if(!user) throw new NotFoundException("Usuario no encontrado");

    return {
      message: "Usuario encontrado con exito",
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<ResponseData> {

    const updateUser = await User.update({

      first_name: updateUserDto.first_name,
      last_name: updateUserDto.last_name
    }, {
      where: {
        id_user: id
      }
    });

    if(updateUser[0] === 0){

      throw new NotFoundException("Usuario no encontrado");
    }

    return {
      statusCode: HttpStatus.RESET_CONTENT,
      message: "Usuario actualizado con exito"
    };
  }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
