export const AppConfigEnvironment = () => ({

    port: parseInt(process.env.PORT, 10) || 3000,
    keyJwt: process.env.SECRET_JWT,
    apiKeyResend: process.env.RESEND_API_KEY,
    keyCrypto: process.env.KEY_CRYPTO,
    domainUrl: process.env.DOMAIN_URL,
    tbkApiKeySecret: process.env.TBK_API_KEY_SECRET,
    tbkApiKeyId: process.env.TBK_API_KEY_ID,
    s3AwsUrl: process.env.S3_AWS_URL,
    paypalClientId: process.env.PAYPAL_CLIENT_ID,
    paypalSecretKey: process.env.PAYPAL_SECRET_KEY,
    paypalUrlApi: process.env.PAYPAL_URL_API,
    database: {

        dialect: process.env.DATABASE_DIALECT as any,
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
        username: process.env.DATABASE_USER,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        logging: false
    }
});