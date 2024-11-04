import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto, UpdatePostUserDto } from './dto/update-post.dto';
import { Auth } from 'src/core/decorators/auth.decorator';
import { ResourcesEnum } from 'src/core/enums/resourses.enum';
import { ActionsEnum } from 'src/core/enums/actions.enum';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { RequestJwt } from 'src/core/interfaces/request-jwt.interface';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @Auth([{ resource: ResourcesEnum.POSTS, action: [ActionsEnum.CREATE] }])
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get('post/:id')
  @Auth([{ resource: ResourcesEnum.POSTS, action: [ActionsEnum.READ] }])
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Put('post/:id')
  @Auth([{ resource: ResourcesEnum.POSTS, action: [ActionsEnum.UPDATE] }])
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete('post/:id')
  @Auth([{ resource: ResourcesEnum.POSTS, action: [ActionsEnum.DELETE] }])
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(id);
  }

  @Post('user')
  @Auth([{ resource: ResourcesEnum.POSTSUSER, action: [ActionsEnum.CREATE] }])
  createPostUser(@Body() createPostDto: CreatePostDto, @Req() request: RequestJwt) {
    return this.postsService.createPostUser(createPostDto, request.user.idUser);
  }

  @Get('user')
  @Auth([{ resource: ResourcesEnum.POSTSUSER, action: [ActionsEnum.READ] }])
  findAllPostsUser(@Req() request: RequestJwt) {
    return this.postsService.findAllPostsUser(request.user.idUser);
  }

  @Get('slug/:slug')
  findOnePostUser(@Param('slug') slug: string) {
    return this.postsService.findOneBySlug(slug);
  }

  @Put('user/:id')
  @Auth([{ resource: ResourcesEnum.POSTSUSER, action: [ActionsEnum.UPDATE] }])
  updatePostUser(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostUserDto, @Req() request: RequestJwt) {
    return this.postsService.updatePostUser(id, request.user.idUser, updatePostDto);
  }

  @Delete('user/:id')
  @Auth([{ resource: ResourcesEnum.POSTSUSER, action: [ActionsEnum.DELETE] }])
  removePostUser(@Param('id', ) id: number, @Req() request: RequestJwt) {
    return this.postsService.removePostUser(id, request.user.idUser);
  }

  @Post('tags')
  @Auth([{ resource: ResourcesEnum.TAGS, action: [ActionsEnum.CREATE] }])
  createTag(@Body() createTagDto: CreateTagDto) {
    return this.postsService.createTag(createTagDto);
  }

  @Get('tags')
  findAllTags() {
    return this.postsService.findAllTags();
  }

  @Get('tags/:id')
  findOneTag(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOneTag(id);
  }

  @Put('tags/:id')
  @Auth([{ resource: ResourcesEnum.TAGS, action: [ActionsEnum.UPDATE] }])
  updateTag(@Param('id', ParseIntPipe) id: number, @Body() updateTagDto: UpdateTagDto) {
    return this.postsService.updateTag(id, updateTagDto);
  }

}
