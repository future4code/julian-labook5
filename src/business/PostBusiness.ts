import { PostDatabase } from "../data/PostDatabase";
import { IdGenerator } from "../services/IdGenerator";

export class PostBusiness{
    private postDatabase = new PostDatabase();
    private idGenerator = new IdGenerator();

    public async create(
        photo: string, 
        description: string,
        type: string, 
        id_user: string
        ){
        const id = this.idGenerator.generate();
        await this.postDatabase.create(id, photo, description, type, id_user);
        return id;
    };
};