CREATE TABLE "Profile" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Profile_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"authId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"dob" date NOT NULL,
	"profile_pic_url" text,
	"bio" varchar(800),
	CONSTRAINT "Profile_authId_unique" UNIQUE("authId"),
	CONSTRAINT "Profile_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "UsersAuth" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "UsersAuth_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"role" "Role" DEFAULT 'User' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "UsersAuth_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "UserAuth" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "Users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "UserAuth" CASCADE;--> statement-breakpoint
DROP TABLE "Users" CASCADE;--> statement-breakpoint
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_requestId_Users_id_fk";
--> statement-breakpoint
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_addresseeId_Users_id_fk";
--> statement-breakpoint
ALTER TABLE "Friends" DROP CONSTRAINT "Friends_userId1_Users_id_fk";
--> statement-breakpoint
ALTER TABLE "Friends" DROP CONSTRAINT "Friends_userId2_Users_id_fk";
--> statement-breakpoint
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_userId1_Users_id_fk";
--> statement-breakpoint
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_userId2_Users_id_fk";
--> statement-breakpoint
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_sender_Users_id_fk";
--> statement-breakpoint
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_authId_UsersAuth_id_fk" FOREIGN KEY ("authId") REFERENCES "public"."UsersAuth"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_requestId_Profile_id_fk" FOREIGN KEY ("requestId") REFERENCES "public"."Profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_addresseeId_Profile_id_fk" FOREIGN KEY ("addresseeId") REFERENCES "public"."Profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_userId1_Profile_id_fk" FOREIGN KEY ("userId1") REFERENCES "public"."Profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_userId2_Profile_id_fk" FOREIGN KEY ("userId2") REFERENCES "public"."Profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_userId1_Profile_id_fk" FOREIGN KEY ("userId1") REFERENCES "public"."Profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_userId2_Profile_id_fk" FOREIGN KEY ("userId2") REFERENCES "public"."Profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_sender_Profile_id_fk" FOREIGN KEY ("sender") REFERENCES "public"."Profile"("id") ON DELETE cascade ON UPDATE no action;