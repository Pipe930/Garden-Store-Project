import * as Joi from "joi";

export const envShema = Joi.object({

    PORT: Joi.number().required().default(3000),
    SECRET_JWT: Joi.string().required(),
    RESEND_API_KEY: Joi.string().required(),
    KEY_CRYPTO: Joi.string().required(),
    DOMAIN_URL: Joi.string().required(),
    DATABASE_DIALECT: Joi.string().required(),
    DATABASE_HOST: Joi.string().required(),
    DATABASE_PORT: Joi.number().required().default(5432),
    DATABASE_NAME: Joi.string().required(),
    DATABASE_USER: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().required()
})