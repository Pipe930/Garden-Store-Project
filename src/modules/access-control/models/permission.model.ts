import { Column, DataType, Table, Model, BelongsToMany, ForeignKey, Sequelize } from "sequelize-typescript";
import { Role } from "./rol.model";
import { ActionsEnum } from "../../../core/enums/actions.enum";
import { ResourcesEnum } from "src/core/enums/resourses.enum";

@Table({
    tableName: "permissions",
    modelName: "Permission",
    timestamps: false
})
export class Permission extends Model {

    @Column({
        primaryKey:true,
        type: DataType.INTEGER,
        autoIncrement: true,
        field: "id_permission"
    })
    declare idPermission: number;

    @Column({
        type: DataType.STRING(100),
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    })
    declare name: string;

    @Column({
        type: DataType.ENUM(...Object.values(ResourcesEnum)),
        allowNull: false
    })
    declare resource: string;

    @Column({
        type: DataType.ARRAY(DataType.ENUM(...Object.values(ActionsEnum))),
        allowNull: false
    })
    declare actions: ActionsEnum[];

    @BelongsToMany(() => Role, () => RolePermission)
    declare Roles: Role[];
}


@Table({
    tableName: "rolePermission",
    modelName: "RolePermission",
    timestamps: false
})
export class RolePermission extends Model {

    @Column({
        primaryKey:true,
        type: DataType.INTEGER,
        autoIncrement: true,
        field: "id_role_permission"
    })
    declare idRolePermission: number;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        field: "date_designed"
    })
    declare dateDesigned: Date;

    @ForeignKey(() => Role)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: "id_role"
    })
    declare idRole: number;

    @ForeignKey(() => Permission)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: "id_permission"
    })
    declare idPermission: number;
}