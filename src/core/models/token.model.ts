import { Column, DataType, Table, Model, Sequelize } from "sequelize-typescript";

@Table({
    tableName: "tokenActivation",
    modelName: "TokenActivation",
    timestamps: false
})
export class TokenActivation extends Model {

    @Column({
        primaryKey: true,
        type: DataType.INTEGER,
        autoIncrement: true,

    })
    declare idToken: number;

    @Column({
        type: DataType.STRING(300),
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

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare idUser: number;
}