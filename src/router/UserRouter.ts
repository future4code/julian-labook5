import express from "express"
import { 
    invite, 
    getFeedByType, 
    getFeed, 
    deleteUser 
} from "../controller/UserController";

export const userRouter = express.Router();

userRouter.post('/invite/:id', invite);

userRouter.get("/feed/:type", getFeedByType);

userRouter.get("/feed", getFeed);

userRouter.delete('/undo/:id', deleteUser);