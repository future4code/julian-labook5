import express, {Request, Response} from "express"
import { Authenticator } from "../services/Authenticator";
import { UserDatabase } from "../data/UserDatabase";
import { HashManager } from "../services/HashManager";

export const loginRouter = express.Router();

loginRouter.post("/login", async (req: express.Request, res: express.Response) => {
    try {
        const userData =
        {
            email: req.body.email,
            password: req.body.password
        }

        const userDatabase = new UserDatabase();
        const user = await userDatabase.getByEmail(userData.email);

        const hashManager = new HashManager()
        const comparePassword = await hashManager.compare(userData.password, user.password)

        if (user.email !== userData.email) {
            throw new Error("E-mail inválido.");
        }

        if (comparePassword === false) {
            throw new Error("Senha inválida.");
        }

        const authenticator = new Authenticator();
        const token = authenticator.generateToken({ id: user.id });

        res.status(200).send({ token });

    } catch (err) {
        res.status(400).send({
            message: err.message,
        });
    }

});
