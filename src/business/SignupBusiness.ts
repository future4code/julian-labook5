import { IdGenerator } from "../services/IdGenerator";
import { UserDatabase } from "../data/UserDatabase";
import { HashManager } from "../services/HashManager";
import { Authenticator } from "../services/Authenticator";

export class SignupBusiness {
    async signup(name: string, email: string, password: string){
        
        const idGenerator = new IdGenerator();
        const id = idGenerator.generate();
        
        const hashManager = new HashManager();
        const cipherText = await hashManager.hash(password);
        
        const authenticator = new Authenticator();
        const token = authenticator.generateToken({ id }) // estava no SignupController, vem pra cá mesmo?
        
        const userDB = new UserDatabase();
        const user = await userDB.create(id, name, email, cipherText);
        
        return token;
       
    }
}