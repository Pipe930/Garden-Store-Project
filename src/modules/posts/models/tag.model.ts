import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Post } from "./post.models";

@Table({
    tableName: "tags",
    modelName: "Tag",
    timestamps: false
})
export class Tag extends Model {

    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER
    })
    declare idTag: number;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        unique: true
    })
    declare name: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        unique: true
    })
    declare slug: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    declare description: string;
}


@Table({
    tableName: "post_tag",
    timestamps: false
})
export class PostTag extends Model {

    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER
    })
    declare idPostTag: number;

    @ForeignKey(() => Post)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare idPost: number;

    @ForeignKey(() => Tag)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare idTag: number;
}