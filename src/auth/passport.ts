import { type DoneCallback } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import db from "../config/drizzle.js";
import { usersAuth } from "../db/schema.js";
import { takeUniqueOrThrow } from "../util/db/takeUniuqeOrThrow.js";
import bcrypt from "bcryptjs";
import { AppError } from "../util/error.js";
import type { NextFunction, Request, Response } from "express";
import { eq } from "drizzle-orm";
/**
 * AUTH FLOW OVERVIEW
 * ----------------------------------------------------
 * 1. STRATEGY
 *    Runs once, when the user submits login credentials.
 *    Verifies username/password against the DB.
 *    If valid -> done(null, user) passes the full user object forward.
 *
 * 2. SERIALIZER
 *    Runs once, right after a successful login.
 *    Takes the user object from the strategy and picks ONE property
 *    (user.id) to store in the session. This keeps the session small -
 *    only the id lives in the session store / cookie, nothing sensitive.
 *
 * 3. DESERIALIZER
 *    Runs on EVERY subsequent request (as long as a valid session
 *    cookie is present). Takes the stored id, looks the user back up
 *    in the DB, and passes the result to done(null, user).
 *    Whatever is passed here becomes req.user for that request.
 *
 * NOTE: The deserializer does NOT re-check credentials - the session
 * cookie itself is the proof of a prior valid login. It just re-hydrates
 * the full user object from the id so req.user is available downstream.
 * ----------------------------------------------------
 */

// Incase if you have different name in the front end:
//.  new LocalStrategy(
//     { usernameField: "email", passwordField: "pass" },   <= this changes what gets read from req.body
//     async (username, password, done) => { ... }  <= these names still don't matter
//.   )

const INVALID = { message: "Invalid email or password" };

const localStart = new LocalStrategy(
  { usernameField: "email", passwordField: "password" },
  async function (username, password, done) {
    try {
      const user = await db
        .select()
        .from(usersAuth)
        .where(eq(usersAuth.email, username.toLowerCase()))
        .then(takeUniqueOrThrow);
      if (user) {
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (isValidPassword) {
          return done(null, user);
        } else {
          return done(null, false, INVALID); // invalid password
        }
      }
    } catch (e: any) {
      // the error can either be when unique user is not found/ more than 1 user is found or actual server error
      if (e.message === "DNE") {
        return done(null, false, INVALID); // user does not exist // no correspondig email/password found
      }
      return done(new AppError(e.message, 500, false)); // shit oh no, server error or more than 1 user in the db which is also an error(probably not this, since there are db checks)
    }
  },
);

//decides which value to store in the session table i.e user.id

const serializer = (
  user: Express.User,
  done: (err: any, id: number) => void,
) => {
  return done(null, user.id);
};

//runs on every server requsest to get the corresponding value &  populate req.user with the fetched user object
const derserializer = async (
  id: number,
  done: (err: any, user?: Express.User | false | null) => void,
) => {
  try {
    const user = await db
      .select()
      .from(usersAuth)
      .where(eq(usersAuth.id, id))
      .then(takeUniqueOrThrow);

    return done(null, user);
  } catch (e: any) {
    // the error can either be when unique user is not found/ more than 1 user is found or actual server error
    if (e.message === "DNE") {
      return done(null, false); // corresponding user with that id not found
    }
    return done(new AppError(e.message, 500, false)); // shit server error. 2012 server version / more than 1 user in the db
  }
};

export { localStart, serializer, derserializer };
