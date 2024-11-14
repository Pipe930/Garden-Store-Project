import { Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Purchase } from "../../purchase/models/purchase.model";
import { Address } from "src/modules/address/models/address.model";

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
        field: 'full_name',
        validate: {
            len: [3, 100],
            notEmpty: true
        }
    })
    declare fullName: string;

    @Column({
        type: DataType.STRING(10),
        allowNull: false,
        unique: true,
        validate: {
            is: /^\d{8}-[\dkK]$/,
            notEmpty: true
        }
    })
    declare rut: string;

    @Column({
        type: DataType.STRING(12),
        allowNull: false,
        unique: true,
        validate: {
            is: /^\+569\d{8}$/,
            notEmpty: true
        }
    })
    declare phone: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: true
        }
    })
    declare email: string;

    @ForeignKey(() => Address)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: 'id_address'
    })
    declare idAddress: number;

    @HasMany(() => Purchase)
    declare purchases: Purchase[];
}