import { Column, DataType, HasMany, Model, Sequelize, Table } from "sequelize-typescript";
import { Product } from "src/modules/products/models/product.model";


@Table({
    tableName: 'offers',
    modelName: 'Offer',
    timestamps: false
})
export class Offer extends Model {
    
    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER,
        field: 'id_offer'
    })
    declare idOffer: number;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        unique: true
    })
    declare title: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'start_date'
    })
    declare startDate: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: 'end_date'
    })
    declare endDate: Date;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true
    })
    declare status: boolean;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 100
        }
    })
    declare discount: number;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    declare description: string;

    @HasMany(() => Product)
    declare products: Product[];
}
