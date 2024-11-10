import { BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePostDto, CreatePostUserDto, TagsList } from './dto/create-post.dto';
import { UpdatePostDto, UpdatePostUserDto } from './dto/update-post.dto';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { Post } from './models/post.models';
import { CreateTagDto } from './dto/create-tag.dto';
import { PostTag, Tag } from './models/tag.model';
import { User } from '../users/models/user.model';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { Reaction } from './models/reaction.model';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PaginateDto } from '../products/dto/paginate.dto';
import { SearchPostDto } from './dto/search-post.dto';
import { Op } from 'sequelize';
import { ReactionsEnum } from 'src/core/enums/reactions.enum';

@Injectable()
export class PostsService {

  constructor(
    private readonly httpService: HttpService, 
    private readonly configService: ConfigService
  ) {}

  async create(createPostDto: CreatePostDto): Promise<ResponseData> {

    const { title, subtitle, content, published, idUser, tags, file, filename, typeFormat } = createPostDto;

    const userFind = await User.findByPk(idUser);

    await this.validTitlePost(title);
    if(!userFind) throw new NotFoundException('Usuario no encontrado');
    if(tags.length === 0) throw new BadRequestException('El post debe tener al menos una etiqueta');

    try {

      const newPost = Post.build({
        title: this.createTitle(title),
        subtitle: this.createTitle(subtitle),
        content,
        published,
        thumbnail: "",
        slug: this.createSlug(title),
        idUser
      });

      newPost.thumbnail = await this.imageLoad(file, filename, typeFormat, newPost.idPost);

      await newPost.save();

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

  async findAll(paginateDto: PaginateDto): Promise<ResponseData> {

    let { page, limit } = paginateDto;

    if(!page) page = 1;
    if(!limit) limit = 20;

    const offset = (page - 1) * limit;

    const posts = await Post.findAll({
      where: { published: true },
      include: [
        {
          model: Tag,
          through: {
            attributes: []
          },
          attributes: ['idTag', 'name']
        }
      ],
      limit,
      offset
    });

    if(posts.length === 0) return { message: "No tenemos publicaciones registrados", statusCode: HttpStatus.NO_CONTENT }

    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(await Post.count() / limit);

    return {
      statusCode: HttpStatus.OK,
      count: posts.length,
      currentPage,
      totalPages,
      data: posts
    }
  }

  async findAllAdmin(): Promise<ResponseData> {

    const posts = await Post.findAll();

    if(posts.length === 0) return { message: "No tenemos publicaciones registrados", statusCode: HttpStatus.NO_CONTENT }

    return {
      statusCode: HttpStatus.OK,
      data: posts
    }
  }

  async findOneBySlug(slug: string): Promise<ResponseData> {

    const post = await Post.findOne(
      {
        where: { slug }, 
        include: [ 
          { 
            model: Tag, 
            attributes: ["idTag", "name"],
            through: {
              attributes: []
            }
          }
        ] 
      });

    if(!post) throw new NotFoundException("Publicación no encontrada");

    return {
      statusCode: HttpStatus.OK,
      data: post
    };
  }

  async findOne(id: number): Promise<ResponseData> {

    const post = await Post.findByPk(id, {
      include: [
        {
          model: Tag,
          through: {
            attributes: []
          },
          attributes: ['idTag', 'name']
        }
      ]
    });

    if(!post) throw new NotFoundException("Publicación no encontrada");

    return {
      statusCode: HttpStatus.OK,
      data: post
    };
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<ResponseData> {

    const { title, subtitle, content, published, idUser, tags } = updatePostDto;

    const post = await Post.findByPk(id, {
      include: [
        {
          model: Tag,
          through: {
            attributes: []
          },
          attributes: ['idTag', 'name']
        }
      ]
    });
    const userFind = await User.findByPk(idUser);

    if(!post) throw new NotFoundException("Publicación no encontrada");
    if(!userFind) throw new NotFoundException('Usuario no encontrado');
    if(post.title !== title) await this.validTitlePost(title);

    try {

      post.title = this.createTitle(title);
      post.subtitle = this.createTitle(subtitle);
      post.content = content;
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

  async postSearch(searchPostDto: SearchPostDto): Promise<ResponseData> {

    const { title } = searchPostDto;

    const posts = await Post.findAll({
      where: {
          title: {
            [Op.iLike]: `%${title}%`
          },
          published: true
      },
      include: [
        {
          model: Tag,
          through: {
            attributes: []
          },
          attributes: ['idTag', 'name']
        }
      ]
    });

    return {
      statusCode: HttpStatus.OK,
      data: posts
    }
  }

  async filterTagPost(idTag: number): Promise<ResponseData> {

    const posts = await Post.findAll({
      where: { published: true },
      include: [
        {
          model: Tag,
          through: {
            attributes: []
          },
          attributes: ['idTag', 'name'],
          where: {
            idTag
          }
        }
      ]
    });

    if(posts.length === 0) return { message: "No tenemos publicaciones registrados", statusCode: HttpStatus.NO_CONTENT }

    return {
      statusCode: HttpStatus.OK,
      data: posts
    }
  }

  async createPostUser(createPostUserDto: CreatePostUserDto, idUser: number): Promise<ResponseData> {
      
      const { title, subtitle, content, published, tags, file, filename, typeFormat } = createPostUserDto;

      const userFind = await User.findByPk(idUser);

      await this.validTitlePost(title);
      if(!userFind) throw new NotFoundException('Usuario no encontrado');
      if(tags.length === 0) throw new BadRequestException('Debe enviar al menos una etiqueta');
  
      try {
  
        const newPost = Post.build({
          title: this.createTitle(title),
          subtitle: this.createTitle(subtitle),
          content,
          published,
          thumbnail: "",
          slug: this.createSlug(title),
          idUser
        });

        newPost.thumbnail = await this.imageLoad(file, filename, typeFormat, newPost.idPost);
        await newPost.save(); 

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

  async findAllPostsUser(idUser: number, paginateDto: PaginateDto): Promise<ResponseData> {

    let { page, limit } = paginateDto;

    if(!page) page = 1;
    if(!limit) limit = 20;

    const offset = (page - 1) * limit;

    const posts = await Post.findAll({
      where: { 
        idUser 
      },
      include: [
        {
          model: Tag,
          through: {
            attributes: []
          },
          attributes: ['idTag', 'name']
        }
      ],
      limit,
      offset
    });

    if(posts.length === 0) return { message: "No tenemos publicaciones registrados", statusCode: HttpStatus.NO_CONTENT }

    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(await Post.count() / limit);

    return {
      statusCode: HttpStatus.OK,
      count: posts.length,
      currentPage,
      totalPages,
      data: posts
    }
  }

  async updatePostUser(slugPost: string, idUser: number, updatePostUserDto: UpdatePostUserDto): Promise<ResponseData> {

    const { title, subtitle, content, published, tags, file, filename, typeFormat } = updatePostUserDto;

    const post = await Post.findOne({
      where: { 
        slug: slugPost,
        idUser
      },
      include: [
        {
          model: Tag,
          through: {
            attributes: []
          },
          attributes: ['idTag', 'name']
        }
      ]
    });
    const userFind = await User.findByPk(idUser);

    if(!post) throw new NotFoundException("Publicación no encontrada");
    if(!userFind) throw new NotFoundException('Usuario no encontrado');
    if(post.title !== title) await this.validTitlePost(title);

    try {

      post.title = this.createTitle(title);
      post.subtitle = this.createTitle(subtitle);
      post.content = content;
      post.published = published;
      post.thumbnail = await this.imageLoad(file, filename, typeFormat, post.idPost);
      post.slug = this.createSlug(title);
      post.idUser = idUser;

      await this.updateTags(post, tags);
      await post.save();

    } catch (error) {

      console.log(error);
      throw new InternalServerErrorException('Error al actualizar la publicación');
    }
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Publicación actualizada con exito'
    };
  }

  async removePostUser(slugPost: string, idUser: number): Promise<ResponseData> {

    const post = await Post.findOne({
      where: { 
        slug: slugPost,
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

    const tags = await Tag.findAll({
      attributes: ['idTag', 'name']
    });

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

    if(!tag) throw new NotFoundException("Etiqueta no encontrada");
    if(tag.name !== name) await this.validTitleTag(name);

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

  async createReactionLike(createReactionDto: CreateReactionDto, idUser: number): Promise<ResponseData> {

    const { idPost, reaction } = createReactionDto;

    const post = await Post.findByPk(idPost);

    if(!post) throw new NotFoundException("Publicación no encontrada");

    const reactionFind = await Reaction.findOne({
      where: { idPost, idUser }
    });

    try {

      if(reactionFind && reactionFind.reaction === ReactionsEnum.DISLIKE){

        console.log("Se elimino el dislike y se creo un like");

        await reactionFind.destroy();
        post.dislikes -= 1;

        await Reaction.create({
          reaction,
          idPost,
          idUser
        });

        post.likes += 1;
        await post.save();

        return {
          statusCode: HttpStatus.CREATED,
          message: 'Reacción creada con exito'
        }
      } else if(reactionFind) {
        console.log("Se elimino el like");
        await reactionFind.destroy();
        post.likes -= 1;
        await post.save();

        return {
          statusCode: HttpStatus.CREATED,
          message: 'Reacción creada con exito'
        }
      }
      console.log("Se creo un like");
      await Reaction.create({
        reaction,
        idPost,
        idUser
      });

      post.likes += 1;
      await post.save();

    } catch (error) {
      throw new InternalServerErrorException('Error al crear la reacción');
    }

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Reacción creada con exito'
    }
  }

  async createReactionDislike(createReactionDto: CreateReactionDto, idUser: number): Promise<ResponseData> {

    const { idPost, reaction } = createReactionDto;

    const post = await Post.findByPk(idPost);

    if(!post) throw new NotFoundException("Publicación no encontrada");

    const reactionFind = await Reaction.findOne({
      where: { idPost, idUser }
    });

    try {

      if(reactionFind && reactionFind.reaction === ReactionsEnum.LIKE){

        console.log("Se elimino el like y se creo un dislike");

        await reactionFind.destroy();
        post.likes -= 1;

        await Reaction.create({
          reaction,
          idPost,
          idUser
        });

        post.dislikes += 1;
        await post.save();

        return {
          statusCode: HttpStatus.CREATED,
          message: 'Reacción creada con exito'
        }
      } else if(reactionFind) {

        console.log("Se elimino el dislike");
        await reactionFind.destroy();
        post.dislikes -= 1;
        await post.save();

        return {
          statusCode: HttpStatus.CREATED,
          message: 'Reacción creada con exito'
        }
      }

      console.log("Se creo un dislike");

      await Reaction.create({
        reaction,
        idPost,
        idUser
      });

      post.dislikes += 1;
      await post.save();
      

    } catch (error) {
      throw new InternalServerErrorException('Error al crear la reacción');
    }

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Reacción creada con exito'
    }
  }

  async getReactionUser(idPost: number, idUser: number): Promise<ResponseData> {

    const reaction = await Reaction.findOne({
      where: { idPost, idUser }
    });

    if(!reaction) throw new NotFoundException("Reacción no encontrada");

    return {
      statusCode: HttpStatus.OK,
      data: reaction
    };
  }

  async getImagesPost(slugPost: string) {

    const post = await Post.findOne({ where: { slug: slugPost } });

    if(!post) throw new NotFoundException("Publicación no encontrado");  

    try {

      const response = await this.httpService.axiosRef.get(`${this.configService.get<string>("s3AwsUrl") + post.thumbnail}`, { responseType: 'arraybuffer' });

      const buffer = Buffer.from(response.data, 'binary');

      return {
        statusCode: HttpStatus.OK,
        message: "Imagenes encontradas",
        data: {
          filename: post.thumbnail.split("/")[2],
          type: response.headers['content-type'],
          image: buffer.toString('base64')
        }
      }
    } catch (error) {
      throw new InternalServerErrorException("No se pudo obtener la imagen de la publicacion");
    }
  }

  private async imageLoad(file: string, filename: string, typeFormat: string, idPost: number): Promise<string> {

    const postFind = await Post.findByPk(idPost);

    if(postFind){

        const urlThumbnail = postFind.thumbnail.split("/")[2];
        
        if(urlThumbnail !== filename){

          console.log("Eliminando imagen anterior");
          await this.httpService.axiosRef.delete(`${this.configService.get<string>("s3AwsUrl")}/posts/${urlThumbnail}`);
          return await this.loadImageS3(file, filename, typeFormat);
        }

        return `/posts/${urlThumbnail}`;
    }

    return await this.loadImageS3(file, filename, typeFormat);
  }

  private async loadImageS3(file: string, filename: string, typeFormat: string): Promise<string> {

    const [filenameImage, extendsImage] = filename.split(".");
    const nowDate = new Date();
    const newFileNameImage = filenameImage + "-" + new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(nowDate).toString() + "-" + nowDate.getTime().toString() + "." + extendsImage;

    const imageBuffer = Buffer.from(file, 'base64');

    try {
      
      await this.httpService.axiosRef.put(`${this.configService.get<string>("s3AwsUrl")}/posts/${newFileNameImage}`, imageBuffer, {
        headers: {
          'Content-Type': typeFormat,
          'Content-Length': imageBuffer.length
      }
      });
    } catch (error) {
      throw new BadRequestException("No se envio correctamente al proveedor de imagenes");
    }

    return `/posts/${newFileNameImage}`;
  }

  private createTitle(title: string): string {
    return title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
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
