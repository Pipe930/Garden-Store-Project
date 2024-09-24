import { Sequelize } from 'sequelize-typescript';
import { DatabaseConfig } from '../interfaces/database.interface';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { ArrayModels } from './models.import';

export const databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async (configService: ConfigService) => {

            const sequelize = new Sequelize(configService.get<DatabaseConfig>("database"));
            Logger.log("Conexion Database Successfully");
            sequelize.addModels(ArrayModels);
            Logger.log("Models Create Database Successfully");
            await sequelize.sync();
            return sequelize;
        },
        inject: [ConfigService]
    },
];