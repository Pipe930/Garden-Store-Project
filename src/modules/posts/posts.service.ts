import { BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePostDto, CreatePostUserDto, TagsList } from './dto/create-post.dto';
import { UpdatePostDto, UpdatePostUserDto } from './dto/update-post.dto';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { Post } from './models/post.models';
import { CreateTagDto } from './dto/create-tag.dto';
import { PostTag, Tag } from './models/tag.model';
import { User } from '../users/models/user.model';

@Injectable()
export class PostsService {

  async create(createPostDto: CreatePostDto): Promise<ResponseData> {

    const { title, body, published, idUser, tags } = createPostDto;

    const userFind = await User.findByPk(idUser);

    await this.validTitlePost(title);
    if(!userFind) throw new NotFoundException('Usuario no encontrado');

    try {

      const newPost = await Post.create({
        title: title.toLowerCase(),
        body,
        published,
        slug: this.createSlug(title),
        idUser
      });

      if(tags.length === 0) throw new BadRequestException('Debe enviar al menos una etiqueta');

      tags.forEach(async (tag) => {

        await PostTag.create({
          idPost: newPost.idPost,
          idTag: tag.idTag
        });
      });

    } catch (error) {
      throw new InternalServerErrorException('Error al crear la publicación');
    }
    
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Publicación creada con exito'
    };
  }

  async findAll(): Promise<ResponseData> {

    const posts = await Post.findAll({
      where: { published: true }
    });

    if(posts.length === 0) return { message: "No tenemos publicaciones registrados", statusCode: HttpStatus.NO_CONTENT }

    return {
      statusCode: HttpStatus.OK,
      data: posts
    };
  }

  async findOneBySlug(slug: string): Promise<ResponseData> {

    const post = await Post.findOne({ where: { slug } });

    if(!post) throw new NotFoundException("Publicación no encontrada");

    return {
      statusCode: HttpStatus.OK,
      data: post
    };
  }

  async findOne(id: number): Promise<ResponseData> {

    const post = await Post.findByPk(id);

    if(!post) throw new NotFoundException("Publicación no encontrada");

    return {
      statusCode: HttpStatus.OK,
      data: post
    };
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<ResponseData> {

    const { title, body, published, idUser, tags } = updatePostDto;

    const post = await Post.findByPk(id);
    const userFind = await User.findByPk(idUser);

    await this.validTitlePost(title);
    if(!post) throw new NotFoundException("Publicación no encontrada");
    if(!userFind) throw new NotFoundException('Usuario no encontrado');

    try {

      post.title = title.toLowerCase();
      post.body = body;
      post.published = published;
      post.slug = this.createSlug(title);
      post.idUser = idUser;

      await this.updateTags(post, tags);

      await post.save();
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar la publicación');
    }
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Publicación actualizada con exito'
    };
  }

  async remove(id: number): Promise<ResponseData> {

    const post = await Post.findByPk(id);
    if(!post) throw new NotFoundException("Publicación no encontrada");

    await post.destroy();

    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Publicación eliminada con exito'
    };
  }

  async createPostUser(createPostUserDto: CreatePostUserDto, idUser: number): Promise<ResponseData> {
      
      const { title, body, published, tags } = createPostUserDto;

      const userFind = await User.findByPk(idUser);

      await this.validTitlePost(title);
      if(!userFind) throw new NotFoundException('Usuario no encontrado');
  
      try {
  
        const newPost = await Post.create({
          title: title.toLowerCase(),
          body,
          published,
          slug: this.createSlug(title),
          idUser
        });

        if(tags.length === 0) throw new BadRequestException('Debe enviar al menos una etiqueta');

        tags.forEach(async (tag) => {
  
          await PostTag.create({
            idPost: newPost.idPost,
            idTag: tag.idTag
          });
        });
  
      } catch (error) {
        throw new InternalServerErrorException('Error al crear la publicación');
      }
      
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Publicación creada con exito'
      };
  }

  async findAllPostsUser(idUser: number): Promise<ResponseData> {

    const posts = await Post.findAll({
      where: { idUser }
    });

    if(posts.length === 0) return { message: "No tenemos publicaciones registrados", statusCode: HttpStatus.NO_CONTENT }

    return {
      statusCode: HttpStatus.OK,
      data: posts
    };
  }

  async updatePostUser(idPost: number, idUser: number, updatePostUserDto: UpdatePostUserDto): Promise<ResponseData> {

    const { title, body, published, tags } = updatePostUserDto;

    const post = await Post.findOne({
      where: { 
        idPost,
        idUser
      }
    });
    const userFind = await User.findByPk(idUser);

    await this.validTitlePost(title);
    if(!post) throw new NotFoundException("Publicación no encontrada");
    if(!userFind) throw new NotFoundException('Usuario no encontrado');

    try {

      post.title = title.toLowerCase();
      post.body = body;
      post.published = published;
      post.slug = this.createSlug(title);
      post.idUser = idUser;

      await this.updateTags(post, tags);

      await post.save();
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar la publicación');
    }
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Publicación actualizada con exito'
    };
  }

  async removePostUser(idPost: number, idUser: number): Promise<ResponseData> {

    const post = await Post.findOne({
      where: { 
        idPost,
        idUser
      }
    });
    if(!post) throw new NotFoundException("Publicación no encontrada");

    await post.destroy();

    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Publicación eliminada con exito'
    };
  }

  async createTag(createTagDto: CreateTagDto): Promise<ResponseData>{

    const { name, description } = createTagDto;

    await this.validTitleTag(name);

    try {

      await Tag.create({
        name,
        slug: this.createSlug(name),
        description
      });

    } catch (error) {
      throw new InternalServerErrorException('Error al crear la etiqueta');
    }

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Etiqueta creada con exito'
    }
  }

  async findAllTags(): Promise<ResponseData> {

    const tags = await Tag.findAll();

    if(tags.length === 0) return { message: "No tenemos etiquetas registradas", statusCode: HttpStatus.NO_CONTENT }

    return {
      statusCode: HttpStatus.OK,
      data: tags
    };
  }

  async findOneTag(id: number): Promise<ResponseData> {

    const tag = await Tag.findByPk(id);

    if(!tag) throw new NotFoundException("Etiqueta no encontrada");

    return {
      statusCode: HttpStatus.OK,
      data: tag
    };
  }

  async updateTag(id: number, createTagDto: CreateTagDto): Promise<ResponseData> {

    const { name, description } = createTagDto;

    const tag = await Tag.findByPk(id);

    await this.validTitleTag(name);
    if(!tag) throw new NotFoundException("Etiqueta no encontrada");

    try {

      tag.name = name;
      tag.slug = this.createSlug(name);
      tag.description = description;

      await tag.save();
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar la etiqueta');
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Etiqueta actualizada con exito'
    };
  }

  private async updateTags(post: Post, tags: TagsList[]): Promise<void> {

    const currentTagsIds = post.tags.map(p => p.idTag);
    const newTagsIds = tags.map(p => p.idTag);

    const areTagsEqual = currentTagsIds.length === newTagsIds.length &&
    currentTagsIds.every(id => newTagsIds.includes(id));

    if (!areTagsEqual) {
        
        const tagsToAdd = newTagsIds.filter(id => !currentTagsIds.includes(id));
        const tagsToRemove = currentTagsIds.filter(id => !newTagsIds.includes(id));
    
        for (let idTag of tagsToAdd) {
            await PostTag.create({
                idPost: post.idPost,
                idTag
            });
        }

        for (let idTag of tagsToRemove) {
            await PostTag.destroy({
                where: {
                    idPost: post.idPost,
                    idTag
                }
            });
        }
    }
  }

  private async validTitlePost(title: string): Promise<void> {

    const postFind = await Post.findOne({ where: { title: title.toLowerCase() } });

    if(postFind) throw new ConflictException('El titulo de la publicación ya existe');
  }

  private async validTitleTag(name: string): Promise<void> {

    const tagFind = await Tag.findOne({ where: { name } });

    if(tagFind) throw new ConflictException('El nombre de la etiqueta ya existe');
  }

  private createSlug(title: string): string {
    return title.toLowerCase().replace(/ /g, '-');
  }
}
