import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Cart } from "./cart.model";
import { Product } from "src/modules/products/models/product.model";

@Table({
    tableName: "items",
    modelName: "Item",
    timestamps: false
})
export class Item extends Model {

    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER,
        field: "id_item_cart"
    })
    declare idItemCart: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    })
    declare quantity: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: "price_unit",
        validate: {
            min: 1000
        }
    })
    declare priceUnit: number;

    @ForeignKey(() => Cart)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: "id_cart_user"
    })
    declare idCartUser: number;

    @ForeignKey(() => Product)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: "id_product"
    })
    declare idProduct: number;

    @BelongsTo(() => Product)
    declare product: Product;
}