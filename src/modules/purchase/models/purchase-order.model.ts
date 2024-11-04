import { Column, CreatedAt, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Purchase } from "./purchase.model";
import { Branch } from "src/modules/branch/models/branch.model";
import { ShippingStatusEnum } from "src/core/enums/statusShipping.enum";

@Table({
    tableName: 'purchase_orders',
    modelName: 'PurchaseOrder',
    timestamps: true
})
export class PurchaseOrder extends Model {

    @ForeignKey(() => Purchase)
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        field: 'id_purchase_order'
    })
    declare idPurchaseOrder: number;

    @CreatedAt
    declare createdAt: Date;

    @Column({
        type: DataType.ENUM(...Object.values(ShippingStatusEnum)),
        allowNull: false,
        defaultValue: ShippingStatusEnum.PREPARATION
    })
    declare status: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'date_delivery'
    })
    declare dateDelivery: Date;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'shipping_cost',
        validate: {
            min: 0
        }
    })
    declare shippingCost: number;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        field: 'address_shipping'
    })
    declare addressShipping: string;

    @ForeignKey(() => Branch)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'id_branch'
    })
    declare idBranch: number;
}