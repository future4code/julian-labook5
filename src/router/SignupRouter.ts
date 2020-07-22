import express, {Request, Response} from "express"
import { signup } from "../controller/SignupController";

export const signupRouter = express.Router();

signupRouter.post('/signup', signup)