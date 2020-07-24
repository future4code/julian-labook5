import { PostDatabase } from "../data/PostDatabase";

import { FriendDatabase } from "../data/FriendDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { GetFeedByTypeDTO, Post } from "../model/Post";
import { promises } from "fs";
import { CustomError } from "../errors/CustomError";

export class UserBusiness {
    private FriendDatabase = new FriendDatabase();
    private postDatabase = new PostDatabase();
    private idGenerator = new IdGenerator();

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
} 