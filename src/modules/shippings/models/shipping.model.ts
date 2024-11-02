import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Sale } from "src/modules/sales/models/sale.model";
import { Address } from "src/modules/address/models/address.model";

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
