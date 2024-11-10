import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, Req, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, CreatePostUserDto } from './dto/create-post.dto';
import { UpdatePostDto, UpdatePostUserDto } from './dto/update-post.dto';
import { Auth } from 'src/core/decorators/auth.decorator';
import { ResourcesEnum } from 'src/core/enums/resourses.enum';
import { ActionsEnum } from 'src/core/enums/actions.enum';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { RequestJwt } from 'src/core/interfaces/request-jwt.interface';
import { PaginateDto } from '../products/dto/paginate.dto';
import { SearchPostDto } from './dto/search-post.dto';
import { CreateReactionDto } from './dto/create-reaction.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @Auth([{ resource: ResourcesEnum.POSTS, action: [ActionsEnum.CREATE] }])
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll(@Query() paginateDto: PaginateDto) {
    return this.postsService.findAll(paginateDto);
  }

  @Get('admin')
  @Auth([{ resource: ResourcesEnum.POSTS, action: [ActionsEnum.READ] }])
  findAllAdmin() {
    return this.postsService.findAllAdmin();
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
  createPostUser(@Body() createPostDto: CreatePostUserDto, @Req() request: RequestJwt) {
    return this.postsService.createPostUser(createPostDto, request.user.idUser);
  }

  @Get('user')
  @Auth([{ resource: ResourcesEnum.POSTSUSER, action: [ActionsEnum.READ] }])
  findAllPostsUser(@Req() request: RequestJwt, @Query() paginateDto: PaginateDto) {
    return this.postsService.findAllPostsUser(request.user.idUser, paginateDto);
  }

  @Get('image/:slug')
  getImagePost(@Param('slug') slug: string) {
    return this.postsService.getImagesPost(slug);
  }

  @Get('slug/:slug')
  findOnePostUser(@Param('slug') slug: string) {
    return this.postsService.findOneBySlug(slug);
  }

  @Get('search')
  searchPost(@Query() query: SearchPostDto) {
    return this.postsService.postSearch(query);
  }

  @Get('filter/:idTag')
  filterPost(@Param('idTag', ParseIntPipe) idTag: number) {
    return this.postsService.filterTagPost(idTag);
  }

  @Put('user/:slug')
  @Auth([{ resource: ResourcesEnum.POSTSUSER, action: [ActionsEnum.UPDATE] }])
  updatePostUser(@Param('slug') slug: string, @Body() updatePostDto: UpdatePostUserDto, @Req() request: RequestJwt) {
    return this.postsService.updatePostUser(slug, request.user.idUser, updatePostDto);
  }

  @Delete('user/:slug')
  @Auth([{ resource: ResourcesEnum.POSTSUSER, action: [ActionsEnum.DELETE] }])
  removePostUser(@Param('slug') slug: string, @Req() request: RequestJwt) {
    return this.postsService.removePostUser(slug, request.user.idUser);
  }

  @Post('like')
  @Auth([{ resource: ResourcesEnum.POSTSUSER, action: [ActionsEnum.CREATE] }])
  likePost(@Body() body: CreateReactionDto, @Req() request: RequestJwt) {
    return this.postsService.createReactionLike(body, request.user.idUser);
  }

  @Post('dislike')
  @Auth([{ resource: ResourcesEnum.POSTSUSER, action: [ActionsEnum.CREATE] }])
  dislikePost(@Body() body: CreateReactionDto, @Req() request: RequestJwt) {
    return this.postsService.createReactionDislike(body, request.user.idUser);
  }

  @Get('reaction/:idPost')
  @Auth([{ resource: ResourcesEnum.POSTSUSER, action: [ActionsEnum.READ] }])
  getReactions(@Param('idPost', ParseIntPipe) idPost: number, @Req() request: RequestJwt) {
    return this.postsService.getReactionUser(idPost, request.user.idUser);
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
  @Auth([{ resource: ResourcesEnum.TAGS, action: [ActionsEnum.READ] }])
  findOneTag(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOneTag(id);
  }

  @Put('tags/:id')
  @Auth([{ resource: ResourcesEnum.TAGS, action: [ActionsEnum.UPDATE] }])
  updateTag(@Param('id', ParseIntPipe) id: number, @Body() updateTagDto: UpdateTagDto) {
    return this.postsService.updateTag(id, updateTagDto);
  }

}
