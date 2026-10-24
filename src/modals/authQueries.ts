import db from "../config/drizzle.js";
import { usersAuth, profileTable } from "../db/schema.js";

class authQueries {
  signUp = async (
    email: string,
    hashedPassword: string,
    dob: string,
    username: string,
  ) => {
    const [user] = await db
      .insert(usersAuth)
      .values({ email: email.toLocaleLowerCase(), password: hashedPassword })
      .returning({ id: usersAuth.id });
    await db
      .insert(profileTable)
      .values({ authId: user!.id, name: username, dob: dob });
    return user!.id;
  };
}

export default authQueries;
