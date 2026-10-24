import { drizzle } from "drizzle-orm/node-postgres";
import db from "../config/drizzle.js";

import {
  usersAuth,
  profileTable,
  friendRequestTable,
  friendsTable,
  messagesTable,
} from "./schema.js";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Starting database seed...");

  // 1. Clear existing data in reverse order of foreign key dependencies
  await db.delete(messagesTable);
  await db.delete(friendsTable);
  await db.delete(friendRequestTable);
  await db.delete(profileTable);
  await db.delete(usersAuth);

  console.log("Cleared existing data.");

  // 2. Insert Authentication Records (usersAuth)
  const insertedAuth = await db
    .insert(usersAuth)
    .values([
      {
        email: "alice@example.com",
        password: await bcrypt.hash("12345", 10), //hashed password
        role: "User",
      },
      {
        email: "bob@example.com",
        password: "$2b$10$YourHashedPasswordHere2",
        role: "User",
      },
      {
        email: "charlie@example.com",
        password: "$2b$10$YourHashedPasswordHere3",
        role: "Tester",
      },
      {
        email: "diana@example.com",
        password: "$2b$10$YourHashedPasswordHere4",
        role: "Admin",
      },
    ])
    .returning();

  console.log(`Inserted ${insertedAuth.length} auth records.`);

  // Map auth records by email for lookup
  const authByEmail = Object.fromEntries(insertedAuth.map((a) => [a.email, a]));

  // 3. Insert User Profiles (usersTable linked to authId)
  const insertedUsers = await db
    .insert(profileTable)
    .values([
      {
        authId: authByEmail["alice@example.com"]!.id,
        name: "Alice Johnson",
        dob: "1995-04-12",
        profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
        bio: "Software developer and coffee lover. Always down for tech talk!",
      },
      {
        authId: authByEmail["bob@example.com"]!.id,
        name: "Bob Smith",
        dob: "1992-08-23",
        profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
        bio: "Digital artist & gamer. Building worlds in Blender.",
      },
      {
        authId: authByEmail["charlie@example.com"]!.id,
        name: "Charlie Brown",
        dob: "1998-11-05",
        profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
        bio: "Avid reader and trail runner. Catch me in the mountains.",
      },
      {
        authId: authByEmail["diana@example.com"]!.id,
        name: "Diana Prince",
        dob: "1990-01-30",
        profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana",
        bio: "Product manager, amateur chef, and dog mom.",
      },
    ])
    .returning();

  console.log(`Inserted ${insertedUsers.length} user profiles.`);

  const users = Object.fromEntries(insertedUsers.map((u) => [u.name, u]));

  // 4. Insert Friend Requests (Pending, Accepted, Blocked)
  const friendRequests = await db
    .insert(friendRequestTable)
    .values([
      // Alice and Bob: Accepted request
      {
        requestId: users["Alice Johnson"]!.id,
        addresseeId: users["Bob Smith"]!.id,
        status: "accepted",
      },
      // Alice and Charlie: Accepted request
      {
        requestId: users["Charlie Brown"]!.id,
        addresseeId: users["Alice Johnson"]!.id,
        status: "accepted",
      },
      // Bob and Charlie: Pending request
      {
        requestId: users["Bob Smith"]!.id,
        addresseeId: users["Charlie Brown"]!.id,
        status: "pending",
      },
      // Diana blocked Charlie
      {
        requestId: users["Charlie Brown"]!.id,
        addresseeId: users["Diana Prince"]!.id,
        status: "blocked",
      },
    ])
    .returning();

  console.log(`Inserted ${friendRequests.length} friend requests.`);

  // Helper function to order user IDs so userId1 is strictly < userId2
  function formatFriendship(userAId: number, userBId: number) {
    return {
      userId1: Math.min(userAId, userBId),
      userId2: Math.max(userAId, userBId),
    };
  }

  // 5. Insert Friends (only for accepted friend requests)
  const insertedFriends = await db
    .insert(friendsTable)
    .values([
      // Friendship 1: Alice & Bob
      formatFriendship(users["Alice Johnson"]!.id, users["Bob Smith"]!.id),
      // Friendship 2: Alice & Charlie
      formatFriendship(users["Alice Johnson"]!.id, users["Charlie Brown"]!.id),
    ])
    .returning();

  console.log(`Inserted ${insertedFriends.length} active friendships.`);

  // Helper function to format message rows upholding user order & valid sender constraints
  function formatMessage(
    senderId: number,
    recipientId: number,
    messageText: string,
    timeOffsetMinutes = 0,
  ) {
    const userId1 = Math.min(senderId, recipientId);
    const userId2 = Math.max(senderId, recipientId);

    const dateTime = new Date(Date.now() - timeOffsetMinutes * 60 * 1000);

    return {
      userId1,
      userId2,
      sender: senderId,
      message: messageText,
      dateTime,
    };
  }

  // 6. Insert Messages (between active friends)
  const aliceId = users["Alice Johnson"]!.id;
  const bobId = users["Bob Smith"]!.id;
  const charlieId = users["Charlie Brown"]!.id;

  const insertedMessages = await db
    .insert(messagesTable)
    .values([
      // Conversation: Alice <-> Bob
      formatMessage(
        aliceId,
        bobId,
        "Hey Bob! Have you checked out Drizzle ORM yet?",
        30,
      ),
      formatMessage(
        bobId,
        aliceId,
        "Hey Alice! Yeah, I just switched over from Prisma. Loving the type safety!",
        25,
      ),
      formatMessage(
        aliceId,
        bobId,
        "Awesome! The SQL-like query builder is so much more predictable.",
        20,
      ),
      formatMessage(
        bobId,
        aliceId,
        "Totally agree. Let me know if you want to pair on a project sometime.",
        15,
      ),

      // Conversation: Alice <-> Charlie
      formatMessage(
        charlieId,
        aliceId,
        "Hi Alice, are we still meeting for coffee this weekend?",
        60,
      ),
      formatMessage(
        aliceId,
        charlieId,
        "Hey Charlie! Yes, Saturday morning works for me. 10 AM?",
        45,
      ),
      formatMessage(
        charlieId,
        aliceId,
        "Perfect, see you at the usual spot!",
        10,
      ),
    ])
    .returning();

  console.log(`Inserted ${insertedMessages.length} messages.`);
  console.log("✅ Seeding completed successfully!");
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
