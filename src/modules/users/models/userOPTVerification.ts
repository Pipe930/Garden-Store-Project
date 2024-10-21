import { Column, CreatedAt, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";

@Table({
    tableName: 'user_opt_verification',
    modelName: 'UserOPTVerification',
    timestamps: true,
    updatedAt: false
})
export class UserOPTVerification extends Model {

    @ForeignKey(() => User)
    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER,
        allowNull: false
    })
    idUser: number;

    @Column({
        type: DataType.STRING(255),
        allowNull: false
    })
    otp: string;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    expiresAt: Date;
}