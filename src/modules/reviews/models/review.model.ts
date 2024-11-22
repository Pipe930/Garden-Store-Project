import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Product } from "src/modules/products/models/product.model";
import { User } from "src/modules/users/models/user.model";

@Table({
    tableName: "reviews",
    modelName: "Review",
    underscored: true,
    timestamps: true,
    paranoid: true,
})
export class Review extends Model {

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    declare idReview: number;

    @Column({
        type: DataType.STRING(255),
        allowNull: false
    })
    declare title: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    declare content: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    })
    declare rating: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare idUser: number;

    @ForeignKey(() => Product)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare idProduct: number;
}
