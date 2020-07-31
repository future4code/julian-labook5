import { BaseDatabase } from "./BaseDatabase";
import { User } from "../model/User";

export class UserDatabase extends BaseDatabase {
     
  private static TABLE_NAME: string = "Labook_User"; 
  
  async create(
    id: string,      
    name: string,
    email: string,
    password: string
  ) {
    try {
      await this.getConnection()
        .insert({
          id,
          name,
          email,
          password, 
        })
        .into(UserDatabase.TABLE_NAME)

        BaseDatabase.destroyConnection(); 
      } catch (error) {
        throw new Error(error.sqlMessage || error.message)
      }
    }

  async getByEmail(email: string): Promise<User> {
    try {
      const result =
        await this.getConnection()
          .select("*")
          .from(UserDatabase.TABLE_NAME)
          .where({email});
          
          const data = result[0];

        if(!result[0]){
          throw new Error("Email não encontrado");
        }

        const user = new User(data.id, data.name, data.email, data.password);
        return user;
    } catch (err) {
      throw new Error(err.sqlMessage || err.message)
    }
  }

  public async getById(id: string): Promise<User> {
    try{
      const result = await this.getConnection()
        .select("*")
        .from(UserDatabase.TABLE_NAME)
        .where({ id });
      
      const data = result[0];

      if(!result[0]){
        throw new Error("Usuário não encontrado");
      }

      const user = new User(data.id, data.email, data.name, data.password);
      return user;

    } catch (err) {
        throw new Error(err.sqlMessage || err.message)
    }

  }
}
