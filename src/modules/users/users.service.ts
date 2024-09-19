import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../../core/models/user.model';
import { ResponseData } from 'src/core/interfaces/response-data.interface';

@Injectable()
export class UsersService {

  async create(createUserDto: CreateUserDto) {

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

    if(updateUser[0] === 0) throw new NotFoundException("Usuario no encontrado");

    return {
      statusCode: HttpStatus.RESET_CONTENT,
      message: "Usuario actualizado con exito"
    };
  }
}
