import {
  date,
  integer,
  pgTable,
  varchar,
  text,
  pgEnum,
  unique,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const role = pgEnum("Role", ["User", "Tester", "Admin"]);

export const statusEnum = pgEnum("status", ["pending", "accepted", "blocked"]);

export const usersAuth = pgTable("UserAuth", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: text().notNull(),
  role: role().notNull().default("User"),
});

export const usersTable = pgTable("Users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  authId: integer()
    .notNull()
    .unique()
    .references(() => usersAuth.id, { onDelete: "cascade" }),
  name: varchar({ length: 255 }).notNull().unique(),
  dob: date().notNull(),
  profilePic: text("profile_pic_url"), // main blob needs to be stored elsewhere
  bio: varchar({ length: 800 }),
});

// stores the connection/friends relationship between users
//only create if the friendRequest changes to 'accpeted'

export const friendsTable = pgTable(
  "Friends",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId1: integer()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    userId2: integer()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    dateTime: timestamp("dateTime").notNull().defaultNow(),
  },

  (table) => [
    check(
      "friends_user_order_check",
      sql`${table.userId1} < ${table.userId2}`, // makes sure every entry userID 1 is less than userID2 entry. make sure to do comparison check before query. if A < B you can only do (A,B). It will not store (B,A)
    ),
    unique(`unique_friends`).on(table.userId1, table.userId2),
    index("index_userId2").on(table.userId2),
  ],
);

// messages database // make sure to ensure friendsTable has the adresse/sender as friends before sending

export const messagesTable = pgTable(
  "Messages",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId1: integer()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    userId2: integer()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    dateTime: timestamp("dateTime").notNull().defaultNow(),
    sender: integer()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    message: varchar({ length: 1000 }).notNull(),
  },
  (table) => [
    check(
      "messages_user_order_check",
      sql`${table.userId1} < ${table.userId2}`,
    ),
    check(
      "ensure_sender_id_is_either_user1_or_user2",
      sql`${table.sender} = ${table.userId1} OR ${table.sender} = ${table.userId2}`,
    ),
    index("msg_index").on(table.userId1, table.userId2, table.dateTime),
  ],
);

export const friendRequestTable = pgTable(
  "FriendRequest",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    requestId: integer()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    addresseeId: integer()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    status: statusEnum().notNull().default("pending"),
  },
  (table) => [
    check(
      "self_friend_request_not_allowed",
      sql`${table.requestId} != ${table.addresseeId}`,
    ),
    unique("unique_check").on(table.requestId, table.addresseeId),
  ],
);
