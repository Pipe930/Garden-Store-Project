import { Column, DataType, Table, Model, BelongsToMany, HasOne, HasMany } from "sequelize-typescript";
import { Role, RoleUser } from "../../access-control/models/rol.model";
import { RefreshToken } from "./token.model";
import { Address, AddressUser } from "src/modules/address/models/address.model";
import { Subscription } from "src/modules/subscriptions/models/subscription.model";

@Table({
    tableName: "users",
    modelName: "User",
    timestamps: true,
    paranoid: true,
    deletedAt: true
})
export class User extends Model {

    @Column({
        primaryKey:true,
        type: DataType.INTEGER,
        autoIncrement: true,
        field: "id_user"
    })
    declare idUser: number;

    @Column({
        type: DataType.STRING(20),
        allowNull: true,
        defaultValue: "(sin nombre)",
        field: "first_name",
        validate: {
            notEmpty: false,
            len: [3, 20]
        }
    })
    declare firstName: string;

    @Column({
        type: DataType.STRING(20),
        allowNull: true,
        defaultValue: "(sin apellido)",
        field: "last_name",
        validate: {
            notEmpty: false,
            len: [3, 20]
        }
    })
    declare lastName: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: true
        }
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    })
    declare password: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    declare active: boolean;

    @Column({
        type: DataType.STRING(12),
        allowNull: false,
        unique: true,
        validate: {
            is: /^\+56\d{9}$/,
            notEmpty: true,
            len: [12, 12]
        }
    })
    declare phone: string;

    @Column({
        type: DataType.DATE,
        allowNull: true,
        validate: {
            isDate: true
        },
        field: "last_login"
    })
    declare lastLogin: Date;

    @BelongsToMany(() => Role, () => RoleUser)
    declare rolesUser: Role[];

    @HasOne(() => RefreshToken)
    declare refreshToken: RefreshToken;

    @HasOne(() => Subscription)
    declare subscription: Subscription;

    @HasMany(() => AddressUser)
    declare addresses: Address[];
}
