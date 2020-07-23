import express, {Request, Response} from "express"
import { login, } from "../controller/UserController";


export const loginRouter = express.Router();

loginRouter.post("/", login);
