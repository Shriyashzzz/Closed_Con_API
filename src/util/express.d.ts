import { usersAuth } from "../db/schema.ts";

type AuthUser = typeof usersAuth.$inferSelect;

declare global {
  namespace Express {
    interface User extends AuthUser {}
  }
}
