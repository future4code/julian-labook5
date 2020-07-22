import { PostDatabase } from "../data/PostDatabase";

export class PostBusiness{
    private postDatabase = new PostDatabase();

    public async create(
        id: string, 
        photo: string, 
        description: string,
        type: string, 
        id_user: string
        ){
        //viriam as validações de negócio.
        await this.postDatabase.create(id, photo, description, type, id_user);
    };
};