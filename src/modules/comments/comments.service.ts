import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { Comment } from './models/comment.model';

@Injectable()
export class CommentsService {
  async create(createCommentDto: CreateCommentDto, idUser: number): Promise<ResponseData> {

    const { comment, idPost } = createCommentDto;

    try {

      await Comment.create({
        comment,
        idPost,
        idUser
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el comentario');
    }

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Comentario creado con exito'
    }
  }

  async findAllPost(idPost: number): Promise<ResponseData> {

    const comments = await Comment.findAll({
      where: {
        idPost
      }
    });

    if(!comments) return { message: "No tenemos publicaciones registrados", statusCode: HttpStatus.NO_CONTENT }

    return {
      statusCode: HttpStatus.OK,
      data: comments
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto): Promise<ResponseData> {

    const { comment } = updateCommentDto;

    const commentFind = await Comment.findByPk(id);

    if(!commentFind) throw new NotFoundException('Comentario no encontrado');

    try {      
      commentFind.comment = comment;
  
      await commentFind.save();
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar el comentario');
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Comentario actualizado con exito'
    };
  }

  async remove(id: number): Promise<ResponseData> {

    const comment = await Comment.findByPk(id);

    if(!comment) throw new NotFoundException('Comentario no encontrado');

    await comment.destroy();

    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Comentario eliminado con exito'
    };
  }
}
