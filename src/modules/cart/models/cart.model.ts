import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "src/modules/users/models/user.model";
import { Item } from "./item.model";

@Table({
    tableName: "carts",
    modelName: "Cart",
    timestamps: false
})
export class Cart extends Model {

    @ForeignKey(() => User)
    @Column({
        primaryKey: true,
        type: DataType.INTEGER,
        field: "id_cart_user"
    })
    declare idCartUser: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "price_total",
        validate: {
            min: 0
        }
    })
    declare priceTotal: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "quantity_total",
        validate: {
            min: 0
        }
    })
    declare quantityTotal: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "products_total",
        validate: {
            min: 0
        }
    })
    declare productsTotal: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "price_total_discount",
        validate: {
            min: 0
        }
    })
    declare priceTotalDiscount: number;

    @HasMany(() => Item)
    declare items: Item[];
}