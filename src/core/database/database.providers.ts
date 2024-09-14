import { Sequelize } from 'sequelize-typescript';
import { DatabaseConfig } from '../interfaces/database.interface';
import { ConfigService } from '@nestjs/config';

export const databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async (configService: ConfigService) => {

            console.log(__dirname + '/../../modules/**/**/*.entity{.ts,.js}');
            const sequelize = new Sequelize(configService.get<DatabaseConfig>("database"));
            sequelize.addModels([]);
            await sequelize.sync();
            return sequelize;
        },
        inject: [ConfigService]
    },
];