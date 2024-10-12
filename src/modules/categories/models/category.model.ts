import { BeforeCreate, BeforeUpdate, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Product } from "src/modules/products/models/product.model";

@Table({
    tableName: "categories",
    modelName: "Category",
    timestamps: true,
    deletedAt: true,
    paranoid: true
})
export class Category extends Model {

    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER,
        field: "id_category"
    })
    declare idCategory: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    })
    declare name: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    })
    declare slug: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    declare description: string;

    @HasMany(() => Product)
    declare products: Product[];

    @BeforeUpdate
    @BeforeCreate
    static generateSlug(instance: Category) {
        instance.slug = instance.name.toLowerCase().replace(/ /g, "-");
    }

    @BeforeUpdate
    @BeforeCreate
    static titleCase(instance: Category) {
        instance.name = instance.name.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    }
}
