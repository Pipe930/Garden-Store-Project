import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CreateOrderDto } from './create-order.dto';
import { OrderStatusEnum } from 'src/core/enums/statusOrder.enum';

export class UpdateOrderDto extends CreateOrderDto {
    
    @IsEnum(OrderStatusEnum)
    readonly status: string;

    @IsString()
    @IsNotEmpty()
    readonly trackingNumber: string;
}
