import { BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Address } from "src/modules/address/models/address.model";
import { Product } from "src/modules/products/models/product.model";
import { Employee } from "./employee.model";
import { PurchaseOrder } from "src/modules/purchase/models/purchase-order.model";
import { Sale } from "src/modules/sales/models/sale.model";

@Table({
    tableName: 'branchs',
    modelName: 'Branch',
    timestamps: false,
})
export class Branch extends Model {

    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER,
    })
    declare idBranch: number;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    })
    declare name: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    })
    declare tradeName: string;

    @Column({
        type: DataType.STRING(7),
        allowNull: false,
        unique: true,
        validate: {
            is: /^[0-9]{7}$/i,
            notEmpty: true
        }
    })
    declare postalCode: string;

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
        type: DataType.DATE,
        allowNull: false
    })
    declare openingDate: Date;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            min: 100
        }
    })
    declare capacity: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    })
    declare capacityOccupied: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true
    })
    declare status: boolean;

    @ForeignKey(() => Address)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare idAddress: number;
    
    @HasMany(() => Employee)
    declare employees: Employee[];

    @HasMany(() => Sale)
    declare sales: Sale[];
    
    @HasMany(() => PurchaseOrder)
    declare purchaseOrders: PurchaseOrder[];
    
    @BelongsToMany(() => Product, () => ProductBranch)
    declare products: Product[];
}


@Table({
    tableName: 'product_branch',
    modelName: 'ProductBranch',
    timestamps: false,
})
export class ProductBranch extends Model {

    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER,
    })
    declare idProductBranch: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    })
    declare quantity: number;

    @ForeignKey(() => Product)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare idProduct: number;

    @ForeignKey(() => Branch)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare idBranch: number;
}


