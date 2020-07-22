import express, {Request, Response} from "express";
import { Authenticator } from "../services/Authenticator";
import { FriendDatabase } from "../data/FriendDatabase";
import { UserDatabase } from "../data/UserDatabase";
import { PostDatabase } from "../data/PostDatabase";

export const invite = async (req: express.Request, res: express.Response) => {
    try {
        const token = req.headers.authorization as string;

        const authenticator = new Authenticator();
        const authenticationData = authenticator.getData(token);

        const inviteFriend = new FriendDatabase();
        const friend = await inviteFriend.invite(authenticationData.id, req.params.id);

        res.status(200).send("Now you're friends!")

    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
}

export const getFeedByType = async (req: Request, res: Response) => {
    try {
        const type = req.params.type;
        
        const token = req.headers.authorization as string;

        const authenticator = new Authenticator();
        const authenticationData = authenticator.getData(token);

        const userDb = new UserDatabase();
        const user = await userDb.getById(authenticationData.id);

        const postDb = new PostDatabase();
        const post = await postDb.getByType(type);

        const typeFeed = await postDb.getByType(type);

        res.status(200).send({
            /*id: post.id,
            photo: post.photo,
            description: post.description,
            createdAt: post.createdAt,
            type: post.type,
            userId: post.userId*/
            typeFeed
        });
    } catch (error) {
        res.status(400).send({
            message: error.message
        });
    }
}

export const getFeed = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization as string;

        const authenticator = new Authenticator();
        const authenticationData = authenticator.getData(token);

        const post = new PostDatabase();
        const postData = await post.getPosts(authenticationData.id);

        res.status(200).send({
            postData
        })

    } catch (err) {
        res.status(400).send({
            message: err.message,
        });
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const token = req.headers.authorization as string;

        const authenticator = new Authenticator();
        const authenticationData = authenticator.getData(token);
        if (!req.params.id || req.params.id === "") {
            throw new Error("Usuário inválido / Campo vazio.")
        }

        const undoFriend = new FriendDatabase();
        await undoFriend.undo(authenticationData.id, req.params.id);

        res.status(200).send("Você deixou de seguir o perfil")

    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
}

