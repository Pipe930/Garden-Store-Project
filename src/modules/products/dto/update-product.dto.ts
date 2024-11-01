import { IsBoolean, IsNotEmpty } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends CreateProductDto {

    @IsBoolean()
    @IsNotEmpty()
    readonly published: boolean;
}
