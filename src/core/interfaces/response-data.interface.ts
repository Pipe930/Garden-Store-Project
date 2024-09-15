import { Model } from "sequelize";

export interface ResponseData {

    message?: string;
    data?: Array<Model> | Model;
    count?: number; 
    statusCode: number;
}
