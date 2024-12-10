import * as Joi from "joi";

export const envShema = Joi.object({

    PORT: Joi.number().required().default(3000),
    SECRET_JWT: Joi.string().required(),
    RESEND_API_KEY: Joi.string().required(),
    KEY_CRYPTO: Joi.string().required(),
    DOMAIN_URL: Joi.string().required(),
    MODEL_IA_URL: Joi.string().required(),
    TBK_API_KEY_SECRET: Joi.string().required(),
    TBK_API_KEY_ID: Joi.string().required(),
    DATABASE_DIALECT: Joi.string().required(),
    DATABASE_HOST: Joi.string().required(),
    DATABASE_PORT: Joi.number().required().default(5432),
    DATABASE_NAME: Joi.string().required(),
    DATABASE_USER: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().required(),
    S3_AWS_URL: Joi.string().required(),
    PAYPAL_CLIENT_ID: Joi.string().required(),
    PAYPAL_SECRET_KEY: Joi.string().required(),
    PAYPAL_URL_API: Joi.string().required(),
})