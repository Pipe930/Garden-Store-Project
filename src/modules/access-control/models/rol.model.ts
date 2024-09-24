import { Column, DataType, Table, Model, Sequelize, ForeignKey, BelongsToMany, BeforeCreate } from "sequelize-typescript";
import { User } from "../../users/models/user.model";
import { Permission, RolePermission } from "./permission.model";


@Table({
    tableName: "role",
    modelName: "Role",
    timestamps: true
})
export class Role extends Model {

    @Column({
        primaryKey:true,
        type: DataType.INTEGER,
        autoIncrement: true
    })
    declare idRole: number;

    @Column({
        type: DataType.STRING(40),
        unique: true,
        allowNull: false
    })
    declare name: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    declare description: string;

    @BelongsToMany(() => User, () => RoleUser)
    declare users: User[];

    @BelongsToMany(() => Permission, () => RolePermission)
    declare permissions: Permission[];
}


@Table({
    tableName: "roleUser",
    modelName: "RoleUser",
    timestamps: false
})
export class RoleUser extends Model{

    @Column({
        primaryKey:true,
        type: DataType.INTEGER,
        autoIncrement: true
    })
    declare idRoleUser: number;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
    })
    declare dateAsigned: Date;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare idUser: number;

    @ForeignKey(() => Role)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare idRole: number;
}