import express from 'express';
import { 
    invite, 
    undo,
    getFeedByType, 
    getFeed,
  getByType
} from "../controller/UserController";

export const userRouter = express.Router();

userRouter.get("/feed/:type", getByType);

userRouter.post('/invite/:id', invite);

userRouter.delete('/undo/:id', undo);

userRouter.get("/feed/:type", getFeedByType);

userRouter.get("/feed", getFeed);
