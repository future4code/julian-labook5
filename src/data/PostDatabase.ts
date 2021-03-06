import { BaseDatabase } from "./BaseDatabase";
import { GetFeedDTO } from "../model/User";
import { GetByTypeDTO, GetFeedByTypeDTO, Post } from "../model/Post";
import { UserDatabase } from "./UserDatabase";

export class PostDatabase extends BaseDatabase {
    private static TABLE_NAME = "Labook_Post"; 

	async create(
		id: string,      
		photo: string,
		description: string,
		type: string,
		id_user: string,
    ) {
    	try {
        	await this.getConnection()
				.insert({
				id,
				photo,
				description,
				type,
				id_user 
				})
				.into(PostDatabase.TABLE_NAME);

            BaseDatabase.destroyConnection(); 
            
		} catch (error) {
        	throw new Error(error.sqlMessage || error.message);
		}
    }

    public async getById(id: string): Promise<any/**Post[]*/> {
    	const result = await this.getConnection()
			.select("*")
			.from(PostDatabase.TABLE_NAME)
			.where({ id });
			console.log("result getById: ", result)
        return result[0];
    } 

    public getFeed = async (id_user: string): Promise<any> => {
      const result = await this.getConnection().raw(`
          SELECT r.title, r.description, r.createdAt, u.name FROM Cookenu_Recipe r
          JOIN Cookenu_Follow f ON f.userToFollowId = r.id_user AND f.id_user = '${id_user}'
          JOIN Cookenu_User u ON r.id_user = u.id;
        `)
      return result[0]
	}
	

	public async getByType(type: string): Promise<any> {
    	const result = await this.getConnection()
			.select("*")
			.from(PostDatabase.TABLE_NAME)
			.where({ type });
        return result[0];
	};

	public getPosts = async (id_user: string): Promise<Post[]> => {
        const result = await this.getConnection().raw(`
            SELECT p.id, p.photo, p.description, p.createdAt, p.type, p.id_user FROM Labook_Post p 
            JOIN Labook_Friend f ON f.id_user = p.id_user AND f.id_friend = "${id_user}"
            OR f.id_user = "${id_user}" AND f.id_friend = p.id_user;
        `)
        return result[0]
	  }

	async getFeedByType(postData: GetFeedByTypeDTO): Promise<Post[]> {
		
		const offset: number = 5 * (postData.page - 1);
		
		const result = await this.getConnection().raw(`
			SELECT p.id, p.photo, p.description, p.createdAt, p.type, p.id_user 
			FROM Labook_Post p 
			JOIN Labook_Friend f
			ON f.id_user = p.id_user 
			AND f.id_friend = "${postData.id_user}"
			OR f.id_user = "${postData.id_user}"
			AND f.id_friend = p.id_user
			WHERE p.type="${postData.type}"
			LIMIT 5
			OFFSET ${offset};
		`);

		await BaseDatabase.destroyConnection();

		return result[0];
	};
}