import { Column, DataType, Table, Model, ForeignKey, Sequelize } from "sequelize-typescript";
import { User } from "./user.model";

@Table({
    tableName: "tokenActivation",
    modelName: "TokenActivation",
    timestamps: false
})
export class TokenActivation extends Model {

    @ForeignKey(() => User)
    @Column({
        primaryKey: true,
        type: DataType.INTEGER
    })
    declare id_token_user: number;

    @Column({
        type: DataType.UUID,
        allowNull: false,
        unique: true
    })
    declare token: string;

    @Column({
        type: DataType.STRING(2),
        allowNull: false
    })
    declare uuid: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    })
    declare time: Date;
}