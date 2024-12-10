import { randomUUID } from "crypto";
import { BelongsTo, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { Product } from "src/modules/products/models/product.model";
import { User } from "src/modules/users/models/user.model";
import { StatusSaleEnum } from "src/core/enums/statusSale.enum";
import { Branch } from "src/modules/branch/models/branch.model";
import { MethodPaymentEnum } from "src/core/enums/statusPurchase.enum";
import { DeviceUsedEnum } from "src/core/enums/deviceUsed.enum";
import { Order } from "src/modules/orders/models/order.model";

@Table({
    tableName: 'sales',
    modelName: 'Sale',
    timestamps: true
})
export class Sale extends Model {

    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: randomUUID(),
        field: 'id_sale'
    })
    declare idSale: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'price_net',
        validate: {
            min: 1000
        }
    })
    declare priceNet: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'price_iva',
        validate: {
            min: 100
        }
    })
    declare priceIva: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'price_total',
        validate: {
            min: 1000
        }
    })
    declare priceTotal: number;

    @Column({
        type: DataType.ENUM(...Object.values(MethodPaymentEnum)),
        allowNull: true,
        field: 'method_payment'
    })
    declare methodPayment: string;

    @Column({
        type: DataType.ENUM(...Object.values(DeviceUsedEnum)),
        allowNull: false,
        field: 'device_used'
    })
    declare deviceUsed: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'discount_applied',
        validate: {
            min: 0
        }
    })
    declare discountApplied: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'products_quantity',
        validate: {
            min: 1
        }
    })
    declare productsQuantity: number;

    @Column({
        type: DataType.ENUM(...Object.values(StatusSaleEnum)),
        allowNull: false,
        defaultValue: StatusSaleEnum.PENDING
    })
    declare statusPayment: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'id_user'
    })
    declare idUser: number;

    @ForeignKey(() => Branch)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        field: 'id_branch'
    })
    declare idBranch: number;

    @HasMany(() => SaleProduct)
    declare saleProducts: SaleProduct[];

    @HasOne(() => Order)
    declare order: Order;
}

@Table({
    tableName: 'sale_product',
    modelName: 'SaleProduct',
    timestamps: false
})
export class SaleProduct extends Model {

    @Column({
        primaryKey: true,
        type: DataType.INTEGER,
        autoIncrement: true,
        field: 'id_sale_product'
    })
    declare idSaleProduct: number;

    @ForeignKey(() => Sale)
    @Column({
        type: DataType.UUID,
        field: 'id_sale'
    })
    declare idSale: string;

    @ForeignKey(() => Product)
    @Column({
        type: DataType.INTEGER,
        field: 'id_product'
    })
    declare idProduct: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'price_unit',
        validate: {
            min: 1000
        }
    })
    declare priceUnit: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    })
    declare quantity: number;

    @BelongsTo(() => Product)
    declare product: Product;
};
