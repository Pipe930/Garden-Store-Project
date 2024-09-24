import { BeforeCreate, BeforeUpdate, Column, CreatedAt, DataType, DeletedAt, Model, Table } from "sequelize-typescript";

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
    })
    declare idCategory: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
        unique: true
    })
    declare name: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
        unique: true
    })
    declare slug: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    declare description: string;

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
