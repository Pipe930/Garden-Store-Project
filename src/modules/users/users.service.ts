import { HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './models/user.model';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { Role } from '../access-control/models/rol.model';

@Injectable()
export class UsersService {

  async create(createUserDto: CreateUserDto) {

  }

  async findAll(): Promise<ResponseData> {

    const listUsers = await User.findAll<User>({
      attributes: ["idUser", "firstName", "lastName", "email", "createdAt", "updatedAt", "lastLogin", "active"],
      include: [
        {
          model: Role,
          attributes: ["idRole", "name"]
        }
      ]
    });

    if(listUsers.length === 0) return { message: "No tenemos usuarios registrados", statusCode: HttpStatus.NO_CONTENT }

    return {

      statusCode: HttpStatus.OK,
      count: listUsers.length,
      data: listUsers
    };
  }

  async findEmailUser(email: string): Promise<User>{

    const user = await User.findOne<User>({

      where: {
        email
      },
      include: [{
        model: Role
      }]
    })

    return user;
  }

  async findOne(id: number): Promise<ResponseData> {

    const user = await User.findByPk<User>(id);

    if(!user) throw new NotFoundException("Usuario no encontrado");

    return {
      message: "Usuario encontrado con exito",
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<ResponseData> {

    const { first_name, last_name } = updateUserDto;

    const user = await User.findOne<User>({
      where: {
        idUser: id
      },
      attributes: ["idUser", "firstName", "lastName", "email", "createdAt", "updatedAt", "lastLogin", "active"]
    });

    if(!user) throw new NotFoundException("Usuario no encontrado");

    user.firstName = first_name;
    user.lastName = last_name;

    await user.save();

    return {
      statusCode: HttpStatus.OK,
      message: "Usuario actualizado con exito"
    };
  }
}
