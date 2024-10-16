import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Branch } from "./branch.model";
import { Purchase } from "src/modules/purchase/models/purchase.model";

export enum TypeGender {

    MALE = 'M',
    FEMALE = 'F',
    OTHER = 'O'
}

@Table({
    tableName: 'employees',
    modelName: 'Employee',
    timestamps: true
})
export class Employee extends Model {

    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER
    })
    declare idEmployee: number;

    @Column({
        type: DataType.STRING(20),
        allowNull: false,
        validate: {
            len: [3, 20]
        }
    })
    declare firstName: string;

    @Column({
        type: DataType.STRING(20),
        allowNull: false,
        validate: {
            len: [3, 20]
        }
    })
    declare lastName: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    })
    declare email: string;

    @Column({
        type: DataType.STRING(12),
        allowNull: false,
        unique: true,
        validate: {
            is: /^\+56\d{9}$/,
            len: [12, 12]
        }
    })
    declare phone: string;

    @Column({
        type: DataType.ENUM(TypeGender.FEMALE, TypeGender.MALE, TypeGender.OTHER),
        allowNull: false
    })
    declare gender: string;

    @Column({
        type: DataType.STRING(12),
        allowNull: false,
        unique: true,
        validate: {
            is: /^\d{1,8}-[\dkK]$/, 
            len: [11, 12]
        }
    })
    declare rut: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        validate: {
            isDate: true
        }
    })
    declare birthday: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    declare dateContract: Date;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            min: 150000
        }
    })
    declare salary: number;

    @Column({
        type: DataType.STRING(20),
        allowNull: false,
        validate: {
            len: [3, 20]
        }
    })
    declare condition: string;

    @ForeignKey(() => Branch)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare idBranch: number;

    @HasMany(() => Purchase)
    declare purchases: Purchase[];
}