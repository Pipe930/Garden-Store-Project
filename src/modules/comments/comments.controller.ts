import { Controller, Get, Post, Body, Param, Delete, Req, ParseIntPipe, Put } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Auth } from 'src/core/decorators/auth.decorator';
import { ResourcesEnum } from 'src/core/enums/resourses.enum';
import { ActionsEnum } from 'src/core/enums/actions.enum';
import { RequestJwt } from 'src/core/interfaces/request-jwt.interface';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @Auth([{ resource: ResourcesEnum.COMMENTS, action: [ActionsEnum.CREATE] }])
  create(@Body() createCommentDto: CreateCommentDto, @Req() request: RequestJwt) {
    return this.commentsService.create(createCommentDto, request.user.idUser);
  }

  @Get('post/:id')
  findAll(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.findAllPost(id);
  }

  @Put(':id')
  @Auth([{ resource: ResourcesEnum.COMMENTS, action: [ActionsEnum.UPDATE] }])
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @Auth([{ resource: ResourcesEnum.COMMENTS, action: [ActionsEnum.DELETE] }])
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.remove(id);
  }
}
