import express, {Request, Response} from "express"
import { SignupBusiness } from "../business/SignupBusiness"
import { Authenticator } from "../services/Authenticator"

export const signup = async (req: express.Request, res: express.Response) => {
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

        const userBusiness = new SignupBusiness();
        await userBusiness.signup(userData.name, userData.email, userData.password)


        const authenticator = new Authenticator();
        const token = authenticator.generateToken({ id }) // de onde é esse id, ele vai pro signupRouter?

        res.status(200).send({ token })

    } catch (error) {
        res.status(400).send({
            message: error.message
        })
    }
}