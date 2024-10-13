import { Model } from "sequelize";

export interface ResponseData {

    message?: string;
    data?: Array<Model> | Model;
    count?: number;
    currentPage?: number;
    totalPages?: number;
    statusCode: number;
}
