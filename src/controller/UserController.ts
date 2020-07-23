import { Request, Response } from "express";

import { UserBusiness } from "../business/UserBusiness";
import { Authenticator } from "../services/Authenticator";
import { UserDatabase } from "../data/UserDatabase";
import { Post, GetByTypeDTO } from "../model/Post";

export class UserController {

    async getByType(request: Request, response: Response) {
        const userBusiness: UserBusiness = new UserBusiness();
        try {
            const type = request.params.type;

            const token = request.headers.authorization as string;

            const authenticator = new Authenticator();
            const authenticationData = authenticator.getData(token);

            const userDb = new UserDatabase();
            const user = await userDb.getById(authenticationData.id);

            const dataTypeFeed = await userBusiness.getFeedByType(user.id, type);

            response.status(200).send({
                dataTypeFeed: dataTypeFeed
            });
        } catch (error) {
            response.status(400).send({
                error: error.message
            });
        };
    };
};