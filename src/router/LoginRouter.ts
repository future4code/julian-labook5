import express, {Request, Response} from "express"
import { UserController } from "../controller/UserController";


export const loginRouter = express.Router();

loginRouter.post("/", new UserController().login);
