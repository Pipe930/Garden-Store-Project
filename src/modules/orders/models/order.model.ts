import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Sale } from "src/modules/sales/models/sale.model";
import { Address } from "src/modules/address/models/address.model";
import { OrderStatusEnum, WithdrawalEnum } from "src/core/enums/statusOrder.enum";

@Table({
    tableName: 'orders',
    modelName: 'Order',
    timestamps: true
})
export class Order extends Model {

    @ForeignKey(() => Sale)
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        field: 'id_order_sale'
    })
    declare idOrderSale: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        field: 'information_shipping',
        validate: {
            notEmpty: true
        }
    })
    declare informationShipping: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
        field: 'shipping_date'
    })
    declare shippingDate: Date;

    @Column({
        type: DataType.DATE,
        allowNull: true,
        field: 'delivery_date'
    })
    declare deliveryDate: Date;

    @Column({
        type: DataType.ENUM(...Object.values(OrderStatusEnum)),
        defaultValue: OrderStatusEnum.PREPARATION,
        allowNull: false
    })
    declare statusOrder: string;

    @Column({
        type: DataType.ENUM(...Object.values(WithdrawalEnum)),
        allowNull: false
    })
    declare withdrawal: string;

    @Column({
        type: DataType.STRING(40),
        allowNull: false,
        field: 'tracking_number',
        validate: {
            notEmpty: true
        }
    })
    declare trackingNumber: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'shipping_cost',
        validate: {
            min: 0
        }
    })
    declare shippingCost: number;

    @ForeignKey(() => Address)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'id_address'
    })
    declare idAddress: number;
}
