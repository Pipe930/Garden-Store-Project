import { Column, DataType, Table, Model, Sequelize, ForeignKey, BelongsToMany } from "sequelize-typescript";
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
        autoIncrement: true,
        field: "id_role"
    })
    declare idRole: number;

    @Column({
        type: DataType.STRING(40),
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: true
        }
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
        autoIncrement: true,
        field: "id_role_user"
    })
    declare idRoleUser: number;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        field: "date_asigned"
    })
    declare dateAsigned: Date;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: "id_user"
    })
    declare idUser: number;

    @ForeignKey(() => Role)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: "id_role"
    })
    declare idRole: number;
}