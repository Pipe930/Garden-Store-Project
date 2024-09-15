import { Sequelize } from 'sequelize-typescript';
import { DatabaseConfig } from '../interfaces/database.interface';
import { ConfigService } from '@nestjs/config';
import { User } from '../models/user.model';
import { TokenActivation } from '../models/token.model';

export const databaseProviders = [
    {
        provide: 'SEQUELIZE',
        useFactory: async (configService: ConfigService) => {

            const sequelize = new Sequelize(configService.get<DatabaseConfig>("database"));
            sequelize.addModels([
                User,
                TokenActivation
            ]);
            await sequelize.sync();
            return sequelize;
        },
        inject: [ConfigService]
    },
];