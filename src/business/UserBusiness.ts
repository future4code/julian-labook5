import { PostDatabase } from "../data/PostDatabase";

import { FriendDatabase } from "../data/FriendDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { HashManager } from "../services/HashManager";
import { Authenticator } from "../services/Authenticator";
import { UserDatabase } from "../data/UserDatabase";

export class UserBusiness {
    private FriendDatabase = new FriendDatabase();
    private postDatabase = new PostDatabase();
    private idGenerator = new IdGenerator();
    private userDatabase = new UserDatabase();
    private hashManager = new HashManager();
  
    public async getFeedByType(id: string, type: string){
        return await this.postDatabase.getFeedByType(id, type);
    };
    async invite(
        id_user: string,
        id_friend: string
    ) {
        await this.FriendDatabase.invite(id_user, id_friend)
    }

    async undo(
        id_user: string,
        id_friend: string
    ) {
        await this.FriendDatabase.undo(id_user, id_friend)
    }
    
    async create(
        name: string, 
        email: string, 
        password: string
    ){
        const id = this.idGenerator.generate();

        const hashManager = new HashManager();
        const cipherText = await hashManager.hash(password);
        
        const authenticator = new Authenticator();
        const token = authenticator.generateToken({ id }) 

        await this.userDatabase.create(id,  name, email, cipherText);

        return token;
       
    }

} 