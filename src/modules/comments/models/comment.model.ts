import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Post } from "src/modules/posts/models/post.models";
import { User } from "src/modules/users/models/user.model";

@Table({
    tableName: "comments",
    modelName: "Comment",
    timestamps: true,
    paranoid: true
})
export class Comment extends Model {

    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER
    })
    declare idComment: number;

    @Column({
        type: DataType.STRING(255),
        allowNull: false
    })
    declare comment: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    })
    declare likes: number;

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