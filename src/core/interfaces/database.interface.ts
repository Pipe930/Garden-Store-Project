enum typeDatabase {

    db2 = 'db2',
    mariadb = 'mariadb',
    mssql = 'mssql',
    mysql = 'mysql',
    oracle = 'oracle',
    postgres = 'postgres',
    snowflake = 'snowflake',
    sqlite = 'sqlite'
}

export interface DatabaseConfig {

    dialect: typeDatabase;
    host: string;
    port: number;
    username: string;
    database: string;
    password: string;
}
