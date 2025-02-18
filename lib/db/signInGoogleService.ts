import { db } from "@/lib/db";
import { accountsTable, usersTable } from "@/lib/db/schema";
import { D1Adapter } from "@auth/d1-adapter";
import { eq, desc } from 'drizzle-orm'



/** USERS SERVICE **/
export const signInGoogle = async (userId: string) => {
    try {
      const [token] = await db.select({token: accountsTable.idToken}).from(accountsTable).where(eq(accountsTable.userId, userId)).limit(1).orderBy(desc(accountsTable.expiresAt))
      console.log({token:token})
      return token.token

    } catch (error) {
      console.error("Error fetching users:", error)
      return false
    }
}
