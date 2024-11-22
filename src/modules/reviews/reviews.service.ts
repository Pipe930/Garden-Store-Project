import { ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './models/review.model';
import { ResponseData } from 'src/core/interfaces/response-data.interface';
import { Product } from '../products/models/product.model';
import { User } from '../users/models/user.model';

@Injectable()
export class ReviewsService {
  async create(createReviewDto: CreateReviewDto, idUser: number): Promise<ResponseData> {

    const { title, content, rating, idProduct } = createReviewDto;

    const productFind = await Product.findByPk(idProduct);
    
    if(!productFind) throw new NotFoundException("Producto no encontrado");

    const reviewFind = await Review.findOne({
      where: {
        idUser,
        idProduct
      }
    });

    if(reviewFind) throw new ConflictException("Este usuario ya ha realizado una reseña de este producto");

    try {
      await Review.create({
        title,
        content,
        rating,
        idUser,
        idProduct
      });
    } catch (error) {
      throw new InternalServerErrorException("Error al crear la reseña");
    }

    return { message: "Reseña creada con éxito", statusCode: HttpStatus.CREATED };
  }

  async findReviewsProducts(idProduct: number): Promise<ResponseData> {

    const reviews = await Review.findAll({
      where: {
        idProduct
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName']
        }
      ]
    });

    if(reviews.length === 0) return { message: "Este producto no tiene reseñas registradas", statusCode: HttpStatus.NO_CONTENT }

    return {
      statusCode: HttpStatus.OK,
      data: reviews
    };
  }

  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<ResponseData> {

    const { title, content, rating, idProduct } = updateReviewDto;

    const productFind = await Product.findByPk(idProduct);
    const reviewFind = await Review.findByPk(id);

    if(!productFind) throw new NotFoundException("Producto no encontrado");
    if(!reviewFind) throw new NotFoundException("Reseña no encontrada");

    reviewFind.title = title;
    reviewFind.content = content;
    reviewFind.rating = rating;
    reviewFind.idProduct = idProduct;

    await reviewFind.save();

    return {
      message: "Reseña actualizada con éxito",
      statusCode: HttpStatus.OK
    };
  }

  async remove(id: number): Promise<ResponseData> {

    const reviewFind = await Review.findByPk(id);

    if(!reviewFind) throw new NotFoundException("Reseña no encontrada");

    await reviewFind.destroy();

    return {
      message: "Reseña eliminada con éxito",
      statusCode: HttpStatus.OK
    };
  }
}
