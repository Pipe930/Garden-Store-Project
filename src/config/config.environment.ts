export const AppConfigEnvironment = () => ({

    port: parseInt(process.env.PORT, 10) || 3000,
    keyJwt: process.env.SECRET_JWT,
    apiKeyResend: process.env.RESEND_API_KEY,
    database: {

        dialect: process.env.DATABASE_DIALECT as any,
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
        username: process.env.DATABASE_USER,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD
    }
});