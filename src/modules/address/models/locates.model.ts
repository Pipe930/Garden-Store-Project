import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";

@Table({
    tableName: "regions",
    modelName: "Region",
    timestamps: false
})
export class Region extends Model {

    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER,
        field: "id_region"
    })
    declare idRegion: number;

    @Column({
        type: DataType.STRING(60),
        allowNull: false,
        field: "name"
    })
    declare name: string;

    @Column({
        type: DataType.STRING(2),
        allowNull: false
    })
    declare code: string;

    @HasMany(() => Province)
    declare provinces: Province[];
}


@Table({
    tableName: "provinces",
    modelName: "Province",
    timestamps: false
})
export class Province extends Model {

    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER,
        field: "id_province"
    })
    declare idProvince: number;

    @Column({
        type: DataType.STRING(60),
        allowNull: false
    })
    declare name: string;

    @ForeignKey(() => Region)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: "id_region"
    })
    declare idRegion: number;

    @BelongsTo(() => Region)
    declare region: Region;

    @HasMany(() => Commune)
    declare communes: Commune[];
}

@Table({
    tableName: "communes",
    modelName: "Commune",
    timestamps: false
})
export class Commune extends Model {

    @Column({
        primaryKey: true,
        autoIncrement: true,
        type: DataType.INTEGER,
        field: "id_commune"
    })
    declare idCommune: number;

    @Column({
        type: DataType.STRING(60),
        allowNull: false
    })
    declare name: string;

    @ForeignKey(() => Province)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: "id_province"
    })
    declare idProvince: number;

    @BelongsTo(() => Province)
    declare province: Province;
}