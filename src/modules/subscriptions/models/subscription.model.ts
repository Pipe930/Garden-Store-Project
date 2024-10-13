import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/modules/users/models/user.model";

export enum SubscriptionStatus {
    ACTIVE = "activo",
    INACTIVE = "inactivo"
}

@Table({
    tableName: "subscriptions",
    modelName: "Subscription",
    timestamps: true
})
export class Subscription extends Model {

    @ForeignKey(() => User)
    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER
    })
    declare idSubscriptionUser: number;

    @Column({
        type: DataType.ENUM(SubscriptionStatus.ACTIVE, SubscriptionStatus.INACTIVE),
        defaultValue: SubscriptionStatus.ACTIVE,
        allowNull: false
    })
    declare status: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 1
        }
    })
    declare monthsPage: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            min: 1000
        }
    })
    declare mount: number;
}
