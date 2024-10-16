import { BelongsTo, BelongsToMany, Column, CreatedAt, DataType, ForeignKey, HasOne, Model, Table } from "sequelize-typescript";
import { Supplier } from "./supplier.model";
import { Employee } from "src/modules/branch/models/employee.model";
import { Product } from "src/modules/products/models/product.model";
import { randomUUID } from "crypto";
import { PurchaseOrder } from "./purchase-order.model";


export enum StatusPurchase {

    PENDING = 'PENDING',
    PAID = 'PAID',
    CANCELED = 'CANCELED'
}

export enum MethodPayment {

    CREDIT_CARD = 'Tarjeta de crédito',
    DEBIT_CARD = 'Tarjeta de débito',
    PAYPAL = 'Paypal',
    MERCADO_PAGO = 'Mercado Pago',
    TRANSFER = 'Transferencia',
    CASH = 'Efectivo'
}

@Table({
    tableName: 'purchases',
    modelName: 'Purchase',
    timestamps: true
})
export class Purchase extends Model {

    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: randomUUID(),
        field: 'id_purchase'
    })
    declare idPurchase: number;

    @CreatedAt
    declare createAt: Date;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'quantity_total',
        validate: {
            min: 1
        }
    })
    declare quantityTotal: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'total_price',
        validate: {
            min: 1000
        }
    })
    declare totalPrice: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'iva_price',
        validate: {
            min: 100
        }
    })
    declare ivaPrice: number;

    @Column({
        type: DataType.ENUM(StatusPurchase.PENDING, StatusPurchase.PAID, StatusPurchase.CANCELED),
        allowNull: false,
        defaultValue: StatusPurchase.PENDING
    })
    declare status: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'discounts_aplicated',
        validate: {
            min: 0
        }
    })
    declare discountsAplicated: number;

    @Column({
        type: DataType.ENUM(MethodPayment.CASH, MethodPayment.CREDIT_CARD, MethodPayment.DEBIT_CARD, MethodPayment.MERCADO_PAGO, MethodPayment.PAYPAL, MethodPayment.TRANSFER),
        allowNull: false,
        field: 'method_payment'
    })
    declare methodPayment: string;

    @Column({
        type: DataType.STRING(20),
        allowNull: false,
        field: 'invoice_number',
        validate: {
            len: [10, 20]
        }
    })
    declare invoiceNumber: string;

    @ForeignKey(() => Supplier)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'id_supplier'
    })
    declare idSupplier: number;

    @ForeignKey(() => Employee)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'id_employee'
    })
    declare idEmployee: number;

    @HasOne(() => PurchaseOrder)
    declare purchaseOrder: PurchaseOrder;

    @BelongsToMany(() => Product, () => PurchaseProduct)
    declare products: Product[];
}


@Table({
    tableName: 'purchase_products',
    modelName: 'PurchaseProduct',
    timestamps: false
})
export class PurchaseProduct extends Model {

    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER,
        field: 'id_purchase_product'
    })
    declare idPurchaseProduct: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    })
    declare quantity: number;

    @ForeignKey(() => Purchase)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'id_purchase'
    })
    declare idPurchase: number;

    @ForeignKey(() => Product)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'id_product'
    })
    declare idProduct: number;
}