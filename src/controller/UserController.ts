import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { HashManager } from "../services/HashManager";
import { Authenticator } from "../services/Authenticator";
import { SignupInputDTO, GetUserByIdInputDTO } from "../dto/UserDTO";
import {FriendDatabase} from "../data/FriendDatabase"

export class UserController {
    async invite(req: Request, res: Response) {
        const userBusiness: UserBusiness = new UserBusiness();
        try {
            const token = req.headers.authorization as string;
    
            const authenticator = new Authenticator();
            const authenticationData = authenticator.getData(token);
    
            const friend = await userBusiness.invite(authenticationData.id, req.params.id);
    
            res.status(200).send("Now you're friends!")
        } catch (error) {
            res.status(400).send({
                message: error.message
            })
        }
    }

    async undo(req: Request, res: Response) {
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
}