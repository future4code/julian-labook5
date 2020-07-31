import express from "express";
import dotenv from "dotenv";
import { AddressInfo } from "net";

import { postRouter } from "./router/PostRouter";
import { userRouter } from "./router/UserRouter";
import { loginRouter } from "./router/LoginRouter";
import { signupRouter } from "./router/SignupRouter";

dotenv.config();
const app = express();
app.use(express.json());

app.use("/user", userRouter);
app.use("/post", postRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);

const server = app.listen(process.env.PORT || 3003, () => {
    if (server) {
        const address = server.address() as AddressInfo;
        console.log(`Server is running in http://localhost:${address.port}`);
    } else {
        console.error(`Failure upon starting server.`);
    }
});