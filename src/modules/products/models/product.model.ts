import { BelongsTo, Column, DataType, ForeignKey, Is, Table, Model, BeforeCreate, BeforeUpdate } from "sequelize-typescript";
import { Category } from "src/modules/categories/models/category.model";

export enum AvailabilityStatus {
    InStock = "In Stock",
    OutOfStock = "Out of Stock",
    LowStock = "Low Stock"
}

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
    })
    declare idProduct: number;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        unique: true
    })
    declare title: string;

    @Is("validPrice", (value: number) => {

        if (value < 100) {
            throw new Error("El precio no puede ser menor a 100 pesos");
        }
    })
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare price: number;

    @Is("validStock", (value: number) => {

        if (value < 0) {
            throw new Error("El stock no puede ser negativo");
        }
    })
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    declare stock: number;

    @Is("validSold", (value: number) => {

        if (value < 0) {
            throw new Error("La cantidad vendida no puede ser negativa");
        }
    })
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    declare sold: number;

    @Is("validPriceDiscount", (value: number) => {

        if (value < 0) {
            throw new Error("El descuento no puede ser negativo");
        }
    })
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
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
        defaultValue: 0.0
    })
    declare rating: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0
    })
    declare reviewsCount: number;

    @Column({
        type: DataType.ENUM(AvailabilityStatus.InStock, AvailabilityStatus.OutOfStock, AvailabilityStatus.LowStock),
        allowNull: false,
        defaultValue: AvailabilityStatus.OutOfStock
    })
    declare availabilityStatus: string;

    @Column({
        type: DataType.STRING(60),
        allowNull: false
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
        allowNull: false
    })
    declare idCategory: number;

    @BelongsTo(() => Category)
    declare category: Category;

    @BeforeUpdate
    @BeforeCreate
    static generateSlug(product: Product) {
        product.slug = product.title.toLowerCase().replace(/ /g, "-");
    }
}
