import { FriendDatabase } from "../data/FriendDatabase";
import { IdGenerator } from "../services/IdGenerator";

export class UserBusiness {
    private FriendDatabase = new FriendDatabase();
    private idGenerator = new IdGenerator();

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
}