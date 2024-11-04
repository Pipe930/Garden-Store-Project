import { BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "src/modules/users/models/user.model";
import { PostTag, Tag } from "./tag.model";
import { Comment } from "src/modules/comments/models/comment.model";

@Table({
    tableName: "posts",
    modelName: "Post",
    timestamps: true,
    paranoid: true
})
export class Post extends Model {

    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER
    })
    declare idPost: number;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    })
    declare title: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    declare body: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    })
    declare likes: number;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        unique: true
    })
    declare slug: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    })
    declare dislikes: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    declare published: boolean;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    })
    declare views: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare idUser: number;

    @BelongsToMany(() => Tag, () => PostTag)
    declare tags: Tag[];

    @HasMany(() => Comment)
    declare comments: Comment[];
}
