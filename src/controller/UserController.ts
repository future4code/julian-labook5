import express, { Request, Response } from "express";
import { Authenticator } from "../services/Authenticator";
import { FriendDatabase } from "../data/FriendDatabase";
import { UserDatabase } from "../data/UserDatabase";
import { PostDatabase } from "../data/PostDatabase";

import { SignupBusiness } from "../business/SignupBusiness";
import { HashManager } from "../services/HashManager";

import { UserBusiness } from "../business/UserBusiness";

export const getByType = async (req: Request, res: Response) => {
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

export const invite = async (req: Request, res: Response) => {
    const userBusiness: UserBusiness = new UserBusiness();
    try {
        const token = req.headers.authorization as string;

        const authenticator = new Authenticator();
        const authenticationData = authenticator.getData(token);

        await userBusiness.invite(authenticationData.id, req.params.id);

        res.status(200).send("Now you're friends!")
    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
}

export const undo = async (req: Request, res: Response) => {
    const userBusiness: UserBusiness = new UserBusiness();
    try {
        const token = req.headers.authorization as string;

        const authenticator = new Authenticator();
        const authenticationData = authenticator.getData(token);

        const friend = await userBusiness.undo(authenticationData.id, req.params.id);

        res.status(200).send("Broken friendship D:")
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

export const signup = async (req: express.Request, res: express.Response) => {
    try {

        if (!req.body.name || req.body.name === "") {
            throw new Error("Nome inválido / Campo vazio.")

        }
        if (!req.body.email || req.body.email.indexOf("@") === -1) {
            throw new Error("E-mail inválido.")
        }

        if (!req.body.password || req.body.password.length < 6) {
            throw new Error("Senha inválida.")
        }

        const userData = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }

        const userBusiness = new SignupBusiness();
        const token = await userBusiness.signup(userData.name, userData.email, userData.password);

        res.status(200).send({ token })

    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const userData =
        {
            email: req.body.email,
            password: req.body.password
        }

        const userDatabase = new UserDatabase();
        const user = await userDatabase.getByEmail(userData.email);

        const hashManager = new HashManager()
        const comparePassword = await hashManager.compare(userData.password, user.password)

        if (user.email !== userData.email) {
            throw new Error("E-mail inválido.");
        }

        if (comparePassword === false) {
            throw new Error("Senha inválida.");
        }

        const authenticator = new Authenticator();
        const token = authenticator.generateToken({ id: user.id });

        res.status(200).send({ token });

    } catch (err) {
        res.status(400).send({
            message: err.message,
        });
    }

};
