import { Column, DataType, Is, Table, Model, BeforeCreate, HasOne } from "sequelize-typescript";
import { hashSync } from "bcrypt";
import { TokenActivation } from "./token.model";

@Table({
    tableName: "users",
    modelName: "User",
    timestamps: true
})
export class User extends Model {

    @Column({
        primaryKey:true,
        type: DataType.INTEGER,
        autoIncrement: true
    })
    declare id_user: number;

    @Column({
        type: DataType.STRING(20),
        allowNull: true,
        defaultValue: "(sin nombre)"
    })
    declare first_name: string;

    @Column({
        type: DataType.STRING(20),
        allowNull: true,
        defaultValue: "(sin apellido)"
    })
    declare last_name: string;

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
        }
    })
    declare last_login: Date;

    @HasOne(() => TokenActivation)
    declare token: TokenActivation;

    @BeforeCreate
    static hashPassword(instance: User):void{

        instance.password = hashSync(instance.password, 10);
    }
}
