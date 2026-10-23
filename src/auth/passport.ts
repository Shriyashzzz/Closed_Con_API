import { type DoneCallback } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import db from "../config/drizzle.js";
import { usersAuth } from "../db/schema.js";
import { takeUniqueOrThrow } from "../util/db/takeUniuqeOrThrow.js";
import bcrypt from "bcryptjs";
import { AppError } from "../util/error.js";
import type { NextFunction, Request, Response } from "express";
import { eq } from "drizzle-orm";

const localStart = new LocalStrategy(
  { usernameField: "email", passwordField: "password" },
  async function (username, password, done) {
    try {
      //check strategy

      const user = await db
        .select()
        .from(usersAuth)
        .where(eq(usersAuth.email, username))
        .then(takeUniqueOrThrow);
      if (user) {
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (isValidPassword) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect Password" });
        }
      } else {
        return done(null, false, { message: "User does not exist" });
      }
    } catch (e: any) {
      //send the error to error logger method
      return done(new AppError(e.msg, 500, false));
    }
  },
);

const serializer = (
  user: Express.User,
  done: (err: any, id: number) => void,
) => {
  return done(null, user.id);
};

const derserializer = async (
  id: number,
  done: (err: any, user?: Express.User | false | null) => void,
) => {
  try {
    //fetch user
    const user = await db
      .select()
      .from(usersAuth)
      .where(eq(usersAuth.id, id))
      .then(takeUniqueOrThrow);

    if (!user) {
      //if user not found
      return done(null, false);
    }
    return done(null, user);
  } catch (e: any) {
    return new AppError(e.msg, 500, false);
  }
};

export const handleLogOut = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

export { localStart, serializer, derserializer };
