import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

export const CORS : CorsOptions = {

    origin: true,
    methods: 'GET,HEAD,PUT,POST,DELETE,OPTIONS',
    allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, Authorization',
    credentials: true
}