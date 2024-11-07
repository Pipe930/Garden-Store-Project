import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { ReactionsEnum } from "src/core/enums/reactions.enum";
import { Post } from "./post.models";
import { User } from "src/modules/users/models/user.model";

@Table({
    tableName: "reactions",
    modelName: "Reaction",
    timestamps: false
})
export class Reaction extends Model {

    @Column({
        primaryKey: true,
        autoIncrement: true
    })
    declare idReaction: number;

    @Column({
        type: DataType.ENUM(...Object.values(ReactionsEnum)),
    })
    declare reaction: string;

    @ForeignKey(() => Post)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare idPost: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare idUser: number;
}