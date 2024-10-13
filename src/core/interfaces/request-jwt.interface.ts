import { Request } from "express";

export interface RequestJwt extends Request {

    user: {

        idUser: number;
        email: string;
        role: string;
    }
}
