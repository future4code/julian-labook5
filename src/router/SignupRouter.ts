import express, {Request, Response} from "express"
import { signup } from "../controller/UserController";

export const signupRouter = express.Router();

signupRouter.post('/signup', signup)