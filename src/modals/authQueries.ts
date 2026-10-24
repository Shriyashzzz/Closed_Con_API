import db from "../config/drizzle.js";
import { usersAuth, profileTable } from "../db/schema.js";

class AuthQueries {
  async signUp(
    email: string,
    hashedPassword: string,
    dob: string,
    username: string,
  ) {
    return db.transaction(async (tx) => {
      const [user] = await tx
        .insert(usersAuth)
        .values({ email: email.toLowerCase(), password: hashedPassword })
        .returning({ id: usersAuth.id, email: usersAuth.email });
      const [newProfile] = await tx
        .insert(profileTable)
        .values({
          authId: user!.id,
          name: username,
          dob: dob,
        })
        .returning({
          authId: profileTable.authId,
          username: profileTable.name,
          dob: profileTable.dob,
        });
      const userProfile = { ...newProfile, email: user!.email };
      return userProfile;
    });
  }
}

const authQuery = new AuthQueries();

export default authQuery;
