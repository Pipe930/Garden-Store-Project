import { Column, DataType, Table, Model, Sequelize, ForeignKey } from "sequelize-typescript";
import { User } from "./user.model";
import { validate } from "class-validator";

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
        unique: true,
        validate: {
            notEmpty: true
        }
    })
    declare token: string;

    @Column({
        type: DataType.STRING(2),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 2]
        }
    })
    declare uuid: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
    })
    declare time: Date;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare idUser: number;
}


@Table({
    tableName: "refreshToken",
    modelName: "RefreshToken",
    timestamps: false
})
export class RefreshToken extends Model {

    @ForeignKey(() => User)
    @Column({
        primaryKey: true,
        type: DataType.INTEGER,
        autoIncrement: true,
        field: "id_refresh_token"
    })
    declare idRefreshToken: number;

    @Column({
        type: DataType.STRING(300),
        allowNull: false,
        unique: true
    })
    declare token: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: "expiry_date"
    })
    declare expiryDate: Date;
}
