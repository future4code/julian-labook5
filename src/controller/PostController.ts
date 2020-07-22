import { Request, Response } from "express";
import { Authenticator } from "../services/Authenticator";
import { PostBusiness } from "../business/PostBusiness";

import { UserDatabase } from "../data/UserDatabase";
import { IdGenerator } from "../services/IdGenerator";

export class PostController {

    async create(request: Request, response: Response) {
        const postBusiness: PostBusiness = new PostBusiness();
        try {
            const token = request.headers.authorization as string;

            const authenticator = new Authenticator();
            const authenticationData = authenticator.getData(token);

            const postData = {
                photo: request.body.photo,
                description: request.body.description,
                type: request.body.type
            };

            const userDb = new UserDatabase();
            const user = await userDb.getById(authenticationData.id);

            await postBusiness.create(postData.photo, postData.description, postData.type, user.id);
            
            response.status(200).send({
                message: "Post criado com sucesso!"
            });
        } catch (error) {
            response.status(400).send({
                error: error.message
            });
        };
    };
};