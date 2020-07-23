import express from 'express';
import { UserController } from "../controller/UserController";

export const userRouter = express.Router();

userRouter.get("/feed/:type", new UserController().getByType);

userRouter.post('/invite/:id', new UserController().invite);

userRouter.delete('/undo/:id', new UserController().undo);

userRouter.get("/feed/:type", new UserController().getFeedByType);

userRouter.get("/feed", new UserController().getFeed);
