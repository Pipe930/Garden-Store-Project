import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Purchase } from "./purchase.model";

@Table({
    tableName: 'suppliers',
    modelName: 'Supplier',
    timestamps: false
})
export class Supplier extends Model {

    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER,
        field: 'id_supplier'
    })
    declare idSupplier: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
        validate: {
            len: [3, 100]
        }
    })
    declare name: string;

    @Column({
        type: DataType.STRING(12),
        allowNull: false,
        validate: {
            len: [12, 12]
        }
    })
    declare phone: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        validate: {
            isEmail: true
        }
    })
    declare email: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
            max: 5
        }
    })
    declare rating: number;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        validate: {
            isUrl: true
        }
    })
    declare website: string;

    @HasMany(() => Purchase)
    declare purchases: Purchase[];
}