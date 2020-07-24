import { PostDatabase } from "../data/PostDatabase";
import { FriendDatabase } from "../data/FriendDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { HashManager } from "../services/HashManager";
import { Authenticator } from "../services/Authenticator";
import { UserDatabase } from "../data/UserDatabase";
import { GetFeedByTypeDTO, Post } from "../model/Post";
import { CustomError } from "../errors/CustomError";


export class UserBusiness {
    private FriendDatabase = new FriendDatabase();
    private postDatabase = new PostDatabase();
    private idGenerator = new IdGenerator();

    private userDatabase = new UserDatabase();
    private hashManager = new HashManager();

    async getFeedByType(postData: GetFeedByTypeDTO): Promise<Post[]> {

        const validTypes: string[] = ["normal", "evento"];

        if(!validTypes.includes(postData.type)) {
            throw new CustomError(
                406,
                "Parâmetro 'type' deve conter 'normal' ou 'evento'"
            );
        };

        if(!postData.page) {
            throw new CustomError(
                406,
                "Parâmetro 'page' deve ser um número inteiro e positivo"
            );
        };

        const feedByType: Post[] = await new PostDatabase().getFeedByType(postData);

        if(!feedByType.length) {
            throw new CustomError(
                404,
                "Não existem 'posts' do tipo informado"
            );
        };

        return feedByType;

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