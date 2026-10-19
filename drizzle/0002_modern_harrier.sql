CREATE TYPE "public"."Role" AS ENUM('User', 'Tester', 'Admin');--> statement-breakpoint
CREATE TABLE "FriendRequest" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "FriendRequest_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"requestId" integer NOT NULL,
	"addresseeId" integer NOT NULL,
	"status" "status" DEFAULT 'pending' NOT NULL,
	CONSTRAINT "unique_check" UNIQUE("requestId","addresseeId"),
	CONSTRAINT "self_friend_request_not_allowed" CHECK ("FriendRequest"."requestId" != "FriendRequest"."addresseeId")
);
--> statement-breakpoint
CREATE TABLE "Friends" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Friends_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId1" integer NOT NULL,
	"userId2" integer NOT NULL,
	"dateTime" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_friends" UNIQUE("userId1","userId2"),
	CONSTRAINT "friends_user_order_check" CHECK ("Friends"."userId1" < "Friends"."userId2")
);
--> statement-breakpoint
CREATE TABLE "Messages" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Messages_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId1" integer NOT NULL,
	"userId2" integer NOT NULL,
	"dateTime" timestamp DEFAULT now() NOT NULL,
	"sender" integer NOT NULL,
	"message" varchar(1000) NOT NULL,
	CONSTRAINT "messages_user_order_check" CHECK ("Messages"."userId1" < "Messages"."userId2"),
	CONSTRAINT "ensure_sender_id_is_either_user1_or_user2" CHECK ("Messages"."sender" = "Messages"."userId1" OR "Messages"."sender" = "Messages"."userId2")
);
--> statement-breakpoint
CREATE TABLE "UserAuth" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "UserAuth_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"role" "Role" DEFAULT 'User' NOT NULL,
	CONSTRAINT "UserAuth_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "Users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"authId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"dob" date NOT NULL,
	"profile_pic_url" text,
	"bio" varchar(800),
	CONSTRAINT "Users_authId_unique" UNIQUE("authId"),
	CONSTRAINT "Users_name_unique" UNIQUE("name")
);
--> statement-breakpoint
DROP TABLE "friends" CASCADE;--> statement-breakpoint
DROP TABLE "messages" CASCADE;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_requestId_Users_id_fk" FOREIGN KEY ("requestId") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_addresseeId_Users_id_fk" FOREIGN KEY ("addresseeId") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_userId1_Users_id_fk" FOREIGN KEY ("userId1") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_userId2_Users_id_fk" FOREIGN KEY ("userId2") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_userId1_Users_id_fk" FOREIGN KEY ("userId1") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_userId2_Users_id_fk" FOREIGN KEY ("userId2") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_sender_Users_id_fk" FOREIGN KEY ("sender") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Users" ADD CONSTRAINT "Users_authId_UserAuth_id_fk" FOREIGN KEY ("authId") REFERENCES "public"."UserAuth"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "index_userId2" ON "Friends" USING btree ("userId2");--> statement-breakpoint
CREATE INDEX "msg_index" ON "Messages" USING btree ("userId1","userId2","dateTime");