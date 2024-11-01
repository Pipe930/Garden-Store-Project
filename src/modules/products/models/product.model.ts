import { BelongsTo, Column, DataType, ForeignKey, Table, Model, HasMany } from "sequelize-typescript";
import { Category } from "src/modules/categories/models/category.model";
import { ImagesProduct } from "./image.model";
import { Offer } from "src/modules/offers/models/offer.model";
import { AvailabilityStatus } from "src/core/enums/productAviabilityStatus.enum";

@Table({
    tableName: "products",
    modelName: "Product",
    timestamps: true,
    paranoid: true,
})
export class Product extends Model {

    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER,
        field: "id_product"
    })
    declare idProduct: number;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        unique: true
    })
    declare title: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            min: 1000
        }
    })
    declare price: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    })
    declare stock: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    })
    declare sold: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "price_discount",
        validate: {
            min: 0
        }
    })
    declare priceDiscount: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    declare brand: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    declare published: boolean;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
        validate: {
            min: 0.0,
            max: 5.0
        }
    })
    declare rating: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "reviews_count",
        validate: {
            min: 0
        }
    })
    declare reviewsCount: number;

    @Column({
        type: DataType.ENUM(...Object.values(AvailabilityStatus)),
        allowNull: false,
        defaultValue: AvailabilityStatus.OutOfStock,
        field: "availability_status"
    })
    declare availabilityStatus: string;

    @Column({
        type: DataType.STRING(60),
        allowNull: false,
        field: "return_policy"
    })
    declare returnPolicy: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        unique: true
    })
    declare slug: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    declare description: string;

    @ForeignKey(() => Category)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: "id_category"
    })
    declare idCategory: number;

    @ForeignKey(() => Offer)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        field: "id_offer"
    })
    declare idOffer: number;
    
    @HasMany(() => ImagesProduct)
    declare images: ImagesProduct[];

    @BelongsTo(() => Category)
    declare category: Category;

    @BelongsTo(() => Offer)
    declare offer: Offer;
}
