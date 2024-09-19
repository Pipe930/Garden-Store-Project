import { Column, DataType, Is, Table, Model, BeforeCreate, HasOne } from "sequelize-typescript";
import { hashSync } from "bcrypt";

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
    declare idUser: number;

    @Column({
        type: DataType.STRING(20),
        allowNull: true,
        defaultValue: "(sin nombre)",
        
    })
    declare firstName: string;

    @Column({
        type: DataType.STRING(20),
        allowNull: true,
        defaultValue: "(sin apellido)"  
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
        }
    })
    declare last_login: Date;

    @BeforeCreate
    private static hashPassword(instance: User):void{

        instance.password = hashSync(instance.password, 10);
    }
}
