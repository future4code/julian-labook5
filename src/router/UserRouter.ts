import express from "express"
import { 
    invite, 
    undo,
    getFeedByType, 
    getFeed  
} from "../controller/UserController";

export const userRouter = express.Router();

userRouter.post('/invite/:id', invite);

userRouter.delete('/undo/:id', undo);

userRouter.get("/feed/:type", getFeedByType);

userRouter.get("/feed", getFeed);

