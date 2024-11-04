import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Product } from "./product.model";
import { TypeImagesEnum } from "src/core/enums/typeImages.enum";

@Table({
    tableName: "images_product",
    modelName: "Image",
    timestamps: false,
})
export class ImagesProduct extends Model {

    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER,
        field: "id_image"
    })
    declare idImage: number;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        field: "url_image"
    })
    declare urlImage: string;

    @Column({
        type: DataType.ENUM(...Object.values(TypeImagesEnum)),
        allowNull: false,
    })
    declare type: string;

    @ForeignKey(() => Product)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: "id_product"
    })
    declare idProduct: number;
}