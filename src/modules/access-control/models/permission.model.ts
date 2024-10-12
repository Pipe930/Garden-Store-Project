import { Column, DataType, Table, Model, BelongsToMany, ForeignKey } from "sequelize-typescript";
import { Role } from "./rol.model";

enum TypeActions {
    CREATE = "CREATE",
    READ = "READ",
    UPDATE = "UPDATE",
    DELETE = "DELETE"
}

@Table({
    tableName: "permission",
    modelName: "Permission",
    timestamps: true
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
        type: DataType.STRING(100),
        allowNull: false
    })
    declare recourse: string;

    @Column({
        type: DataType.ENUM(TypeActions.CREATE, TypeActions.READ, TypeActions.UPDATE, TypeActions.DELETE),
        allowNull: false
    })
    declare actions: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    declare description: string;

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
        allowNull: false
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