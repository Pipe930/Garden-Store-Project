import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Sale } from "./sale.model";
import { Address } from "src/modules/address/models/address.model";

enum ShippingStatus {
    PREPARING = 'PREPARANDO',
    PENDING = 'PENDIENTE',
    SHIPPED = 'ENVIADO',
    DELIVERED = 'ENTREGADO'
}

@Table({
    tableName: 'shippings',
    modelName: 'Shipping',
    timestamps: true
})
export class Shipping extends Model {

    @ForeignKey(() => Sale)
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        field: 'id_shipping_sale'
    })
    declare idShippingSale: string;

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
        allowNull: false,
        field: 'shipping_date'
    })
    declare shippingDate: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'delivery_date'
    })
    declare deliveryDate: Date;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'tracking_number',
    })
    declare trackingNumber: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'shipping_cost',
        validate: {
            min: 1000
        }
    })
    declare shippingCost: number;

    @Column({
        type: DataType.ENUM(...Object.values(ShippingStatus)),
        allowNull: false
    })
    declare status: string;

    @ForeignKey(() => Address)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'id_address'
    })
    declare idAddress: number;

    @BelongsTo(() => Address)
    declare address: Address;
}
