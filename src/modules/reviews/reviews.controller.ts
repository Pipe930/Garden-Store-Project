import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseIntPipe } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { RequestJwt } from 'src/core/interfaces/request-jwt.interface';
import { Auth } from 'src/core/decorators/auth.decorator';
import { ResourcesEnum } from 'src/core/enums/resourses.enum';
import { ActionsEnum } from 'src/core/enums/actions.enum';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @Auth([{ resource: ResourcesEnum.REVIEWS, action: [ActionsEnum.CREATE] }])
  create(@Body() createReviewDto: CreateReviewDto, @Req() request: RequestJwt) {
    return this.reviewsService.create(createReviewDto, request.user.idUser);
  }

  @Get('product/:idProduct')
  findAllReviews(@Param('idProduct', ParseIntPipe) idProduct: number) {
    return this.reviewsService.findReviewsProducts(idProduct);
  }

  @Patch('review/:id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(+id, updateReviewDto);
  }

  @Delete('review/:id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}
