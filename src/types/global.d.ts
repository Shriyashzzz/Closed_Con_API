import type { PgTimestamp } from "drizzle-orm/pg-core";

export {};

declare global {
  interface UserResponsePayload {
    id: number;
    email: string;
    role: "User" | "Tester" | "Admin";
    createdAt: PgTimestamp;
  }
}
