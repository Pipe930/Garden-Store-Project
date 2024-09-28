import { Column, DataType, Is, Table, Model, BelongsToMany, HasOne, HasMany } from "sequelize-typescript";
import { Role, RoleUser } from "../../access-control/models/rol.model";
import { RefreshToken } from "./token.model";
import { Address, AddressUser } from "src/modules/address/models/address.model";

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
        field: "first_name"
    })
    declare firstName: string;

    @Column({
        type: DataType.STRING(20),
        allowNull: true,
        defaultValue: "(sin apellido)",
        field: "last_name"
    })
    declare lastName: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare password: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    declare active: boolean;

    @Is("phoneValid", (value: string) => {

        const regexTelefonoChile = /^\+56\d{9}$/;

        if(!regexTelefonoChile.test(value)) throw new Error("El numero de telefono no es valido")
        
    })
    @Column({
        type: DataType.STRING(12),
        allowNull: false,
        unique: true
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

    @HasMany(() => AddressUser)
    declare addresses: Address[];
}
