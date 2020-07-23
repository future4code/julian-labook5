import express from "express";
import { UserController } from "../controller/UserController";

export const userRouter = express.Router();

userRouter.post("/invite/:id", new UserController().invite);

userRouter.post("/undo/:id", new UserController().undo);