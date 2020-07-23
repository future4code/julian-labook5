import { PostDatabase } from "../data/PostDatabase";

export class UserBusiness {
    private postDatabase = new PostDatabase();

    public async getFeedByType(id: string, type: string){
        return await this.postDatabase.getFeedByType(id, type);
    };

};