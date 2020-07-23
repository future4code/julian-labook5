import express, {Request, Response} from "express"
import { UserController } from "../controller/UserController";

export const signupRouter = express.Router();

signupRouter.post('/signup', new UserController().signup)