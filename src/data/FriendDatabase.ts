import { BaseDatabase } from "./BaseDatabase";

export class FriendDatabase extends BaseDatabase {

  private static TABLE_NAME = "Labook_Friend";

  async invite(id_user: string, id_friend: string): Promise<any> {
    try {
      await this.getConnection()
        .insert({
          id_user,
          id_friend
        })
        .into(FriendDatabase.TABLE_NAME)

    } catch (err) {
      throw new Error(err.sqlMessage || err.message)
    }
  }

  async undo(id_User: string, id_friend: string): Promise<any> {
    try {
      const result = await this.getConnection().raw(`
      DELETE FROM ${FriendDatabase.TABLE_NAME} 
      WHERE id_friend = "${id_friend}" AND id_user= "${id_User}"
      OR id_friend = "${id_User}" AND id_user= "${id_friend}";
    `)
    } catch (err) {
      throw new Error(err.sqlMessage || err.message)
    }
  }
}