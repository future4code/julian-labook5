import { BaseDatabase } from "./BaseDatabase";

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

    public async getById(id: string): Promise<any> {
    	const result = await this.getConnection()
			.select("*")
			.from(PostDatabase.TABLE_NAME)
			.where({ id });
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
}