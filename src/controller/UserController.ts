import express, { Request, Response } from "express";
import { Authenticator } from "../services/Authenticator";
import { FriendDatabase } from "../data/FriendDatabase";
import { UserDatabase } from "../data/UserDatabase";
import { PostDatabase } from "../data/PostDatabase";
import { HashManager } from "../services/HashManager";
import { UserBusiness } from "../business/UserBusiness";
import { User } from "../model/User";

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

            const dataTypeFeed = await userBusiness.getFeedByType(user.getId(), type);

            response.status(200).send({
                dataTypeFeed: dataTypeFeed
            });
        } catch (error) {
            response.status(400).send({
                error: error.message
            });
        };
    };

    async invite(request: Request, response: Response) {
        const userBusiness: UserBusiness = new UserBusiness();
        try {
            const token = request.headers.authorization as string;

            const authenticator = new Authenticator();
            const authenticationData = authenticator.getData(token);

            await userBusiness.invite(authenticationData.id, request.params.id);

            response.status(200).send("Now you're friends!")
        } catch (error) {
            response.status(400).send({
                message: error.message
            })
        }
    }

    async undo(request: Request, response: Response) {
        const userBusiness: UserBusiness = new UserBusiness();
        try {
            const token = request.headers.authorization as string;

            const authenticator = new Authenticator();
            const authenticationData = authenticator.getData(token);

            await userBusiness.undo(authenticationData.id, request.params.id);

            response.status(200).send("Broken friendship D:")
        } catch (error) {
            response.status(400).send({
                message: error.message
            })
        }
    }

    async getFeedByType(request: Request, response: Response) {
        try {
            const type = request.params.type;

            const token = request.headers.authorization as string;

            const authenticator = new Authenticator();
            const authenticationData = authenticator.getData(token);

            const userDb = new UserDatabase();
            const user = await userDb.getById(authenticationData.id);

            const postDb = new PostDatabase();
            const post = await postDb.getByType(type);

            const typeFeed = await postDb.getByType(type);

            response.status(200).send({ typeFeed });
        } catch (error) {
            response.status(400).send({
                message: error.message
            });
        }
    }

    async getFeed(request: Request, response: Response) {
        try {
            const token = request.headers.authorization as string;

            const authenticator = new Authenticator();
            const authenticationData = authenticator.getData(token);

            const post = new PostDatabase();
            const feed = await post.getPosts(authenticationData.id);

            response.status(200).send({
                feed
            })

        } catch (err) {
            response.status(400).send({
                message: err.message,
            });
        }
    }

    async signup(request: Request, response: Response) {
        try {

            if (!request.body.name || request.body.name === "") {
                throw new Error("Nome inválido / Campo vazio.")

            }
            if (!request.body.email || request.body.email.indexOf("@") === -1) {
                throw new Error("E-mail inválido.")
            }

            if (!request.body.password || request.body.password.length < 6) {
                throw new Error("Senha inválida.")
            }

            const userData = {
                name: request.body.name,
                email: request.body.email,
                password: request.body.password
            }

            const userBusiness = new UserBusiness();
            const token = await userBusiness.create(userData.name, userData.email, userData.password);

            response.status(200).send({ token })

        } catch (error) {
            response.status(400).send({
                message: error.message
            })
        }
    }

    async login(request: Request, response: Response) {
        try {
            const userData =
            {
                email: request.body.email,
                password: request.body.password
            }

            const userDatabase = new UserDatabase();
            const user: User = await userDatabase.getByEmail(userData.email);
            
            const hashManager = new HashManager()
            const comparePassword = await hashManager.compare(userData.password, user.getPassword())
            console.log(user.getEmail(), userData.email, user.getName())
            if (user.getEmail() !== userData.email) {
                throw new Error("E-mail inválido.");
            }

            if (comparePassword === false) {
                throw new Error("Senha inválida.");
            }

            const authenticator = new Authenticator();
            const token = authenticator.generateToken({ id: user.getId()});

            response.status(200).send({ token });

        } catch (err) {
            response.status(400).send({
                message: err.message,
            });
        }

    };
};