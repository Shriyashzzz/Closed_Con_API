import {
  date,
  integer,
  pgTable,
  varchar,
  text,
  pgEnum,
  unique,
  timestamp,
} from "drizzle-orm/pg-core";
import { check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const statusEnum = pgEnum("status", ["pending", "accepted", "blocked"]);

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull().unique(),
  dob: date().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  profilePic: text("profile_pic_url"),
  bio: varchar({ length: 800 }),
});

// stores the connection/friends relationship between users

export const friendsTable = pgTable(
  "friends",
  {
    id: integer().generatedAlwaysAsIdentity(),
    userId1: integer().notNull(),
    userId2: integer().notNull(),
    dateTime: timestamp("dateTime").notNull().defaultNow(),
  },
  (table) => [
    check(
      "check_user_id_store",
      sql`${table.userId1} < ${table.userId2}`, // makes sure every entry userID 1 is less than userID2 entry. make sure to do comparison check before query. if A < B you can only do (A,B). It will not store (B,A)
    ),
    unique(`unique_friends`).on(table.userId1, table.userId2),
  ],
);

// messages database

export const messagesTable = pgTable(
  "messages",
  {
    id: integer().generatedAlwaysAsIdentity(),
    userId1: integer().notNull(),
    userId2: integer().notNull(),
    dateTime: timestamp("dateTime").notNull().defaultNow(),
    sender: integer().notNull(),
  },
  (table) => [
    check("check_user_id_store", sql`${table.userId1} < ${table.userId2}`),
    check(
      "ensure sender id is either user1 or user2",
      sql`${table.sender === table.userId1 || table.sender === table.userId2}`,
    ),
  ],
);
