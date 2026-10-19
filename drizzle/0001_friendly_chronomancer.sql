CREATE TYPE "public"."status" AS ENUM('pending', 'accepted', 'blocked');--> statement-breakpoint
CREATE TABLE "friends" (
	"id" integer GENERATED ALWAYS AS IDENTITY (sequence name "friends_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId1" integer NOT NULL,
	"userId2" integer NOT NULL,
	"dateTime" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_friends" UNIQUE("userId1","userId2"),
	CONSTRAINT "check_user_id_store" CHECK ("friends"."userId1" < "friends"."userId2")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" integer GENERATED ALWAYS AS IDENTITY (sequence name "messages_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId1" integer NOT NULL,
	"userId2" integer NOT NULL,
	"dateTime" timestamp DEFAULT now() NOT NULL,
	"sender" integer NOT NULL,
	CONSTRAINT "check_user_id_store" CHECK ("messages"."userId1" < "messages"."userId2"),
	CONSTRAINT "ensure sender id is either user1 or user2" CHECK ($1)
);
