import { Column, DataType, Table, Model, BelongsToMany, ForeignKey } from "sequelize-typescript";
import { Role } from "./rol.model";

@Table({
    tableName: "permission",
    modelName: "Permission",
    timestamps: true
})
export class Permission extends Model {

    @Column({
        primaryKey:true,
        type: DataType.INTEGER,
        autoIncrement: true
    })
    declare idPermission: number;

    @Column({
        type: DataType.STRING(100),
        unique: true,
        allowNull: false
    })
    declare name: string;

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
        autoIncrement: true
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
        allowNull: false
    })
    declare idRole: number;

    @ForeignKey(() => Permission)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare idPermission: number;
}