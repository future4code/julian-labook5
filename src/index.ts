import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { AddressInfo } from "net";

import { IdGenerator } from "./services/IdGenerator"
import { UserDatabase } from "./data/UserDatabase";
import { Authenticator } from "./services/Authenticator";
import { HashManager } from "./services/HashManager";
import { PostDatabase } from "./data/PostDatabase";
import { FriendDatabase } from "./data/FriendDatabase";

import { postRouter } from "./router/PostRouter";
import { userRouter } from "./router/UserRouter";

dotenv.config();
const app = express();
app.use(express.json());

app.use("/post", postRouter);


app.post('/signup', async (req: express.Request, res: express.Response) => {
    try {

        if (!req.body.name || req.body.name === "") {
            throw new Error("Nome inválido / Campo vazio.")

        }
        if (!req.body.email || req.body.email.indexOf("@") === -1) {
            throw new Error("E-mail inválido.")
        }

        if (!req.body.password || req.body.password.length < 6) {
            throw new Error("Senha inválida.")
        }

        const userData = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }

        const hashManager = new HashManager();
        const cipherText = await hashManager.hash(userData.password);

        const idGenerator = new IdGenerator();
        const id = idGenerator.generate();

        const userDB = new UserDatabase();
        const user = await userDB.create(id, userData.name, userData.email, cipherText)

        const authenticator = new Authenticator();
        const token = authenticator.generateToken({
            id
        })
        res.status(200).send({ token })

    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
})

app.post("/login", async (req: express.Request, res: express.Response) => {
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

/* app.post("/post", async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization as string;

        const authenticator = new Authenticator();
        const authenticationData = authenticator.getData(token);

        const postData = {
            photo: req.body.photo,
            description: req.body.description,
            type: req.body.type
        };

        const userDb = new UserDatabase();
        const user = await userDb.getById(authenticationData.id);

        const idGenerator = new IdGenerator();
        const id = idGenerator.generate();

        const postDb = new PostDatabase();
        await postDb.create(id, postData.photo, postData.description, postData.type, user.id);

        res.status(200).send({
            message: "Post criado com sucesso!"
        });

    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}); */

app.use("/user", userRouter);

/*app.post('/user/invite/:id', async (req: express.Request, res: express.Response) => {
    try {
        const token = req.headers.authorization as string;

        const authenticator = new Authenticator();
        const authenticationData = authenticator.getData(token);

        const inviteFriend = new FriendDatabase();
        const friend = await inviteFriend.invite(authenticationData.id, req.params.id);

        res.status(200).send("Now you're friends!")

    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
})*/

app.get("/user/feed/:type", async (req: Request, res: Response) => {
    try {
        const type = req.params.type;
        
        const token = req.headers.authorization as string;

        const authenticator = new Authenticator();
        const authenticationData = authenticator.getData(token);

        const userDb = new UserDatabase();
        const user = await userDb.getById(authenticationData.id);

        const postDb = new PostDatabase();
        const post = await postDb.getByType(type);

        const typeFeed = await postDb.getByType(type);

        res.status(200).send({
            /*id: post.id,
            photo: post.photo,
            description: post.description,
            createdAt: post.createdAt,
            type: post.type,
            userId: post.userId*/
            typeFeed
        });
    } catch (error) {
        res.status(400).send({
            message: error.message
        });
    }
});



/*app.delete('/user/undo/:id', async (req: express.Request, res: express.Response) => {
    try {
        const token = req.headers.authorization as string;

        const authenticator = new Authenticator();
        const authenticationData = authenticator.getData(token);
        if (!req.params.id || req.params.id === "") {
            throw new Error("Usuário inválido / Campo vazio.")
        }

        const undoFriend = new FriendDatabase();
        await undoFriend.undo(authenticationData.id, req.params.id);

        res.status(200).send("Você deixou de seguir o perfil")

    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
})*/

app.get("/user/feed", async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization as string;

        const authenticator = new Authenticator();
        const authenticationData = authenticator.getData(token);

        const post = new PostDatabase();
        const postData = await post.getPosts(authenticationData.id);

        res.status(200).send({
            postData
        })

    } catch (err) {
        res.status(400).send({
            message: err.message,
        });
    }
});


const server = app.listen(process.env.PORT || 3003, () => {
    if (server) {
        const address = server.address() as AddressInfo;
        console.log(`Server is running in http://localhost:${address.port}`);
    } else {
        console.error(`Failure upon starting server.`);
    }
});