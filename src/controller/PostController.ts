import { Request, Response } from "express";
import { Authenticator } from "../services/Authenticator";
import { PostBusiness } from "../business/PostBusiness";

import { UserDatabase } from "../data/UserDatabase";
import { CreatePostDTO } from "../model/Post";

export class PostController {

    async create(request: Request, response: Response) {
        const postBusiness: PostBusiness = new PostBusiness();
        try {
            const token = request.headers.authorization as string;

            const authenticator = new Authenticator();
            const authenticationData = authenticator.getData(token);

            const postData: CreatePostDTO = {
                photo: request.body.photo as string,
                description: request.body.description as string,
                type: request.body.type as string
            };

            const userDb = new UserDatabase();
            const user = await userDb.getById(authenticationData.id);

            await postBusiness.create(postData.photo, postData.description, postData.type, user.getId());
            
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