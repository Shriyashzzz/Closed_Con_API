import db from "../config/drizzle.js";
import { usersTable } from "./schema.js";

async function seedDb() {
  const dummyUser: typeof usersTable.$inferInsert = {
    name: "dummy1",
    dob: "10/18/2026",
    email: "dummyemail@email.com",
    bio: "yooo, me dum dum",
  };
  await db.insert(usersTable).values(dummyUser);
}

seedDb();
