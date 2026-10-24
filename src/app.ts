import express from "express";
import passport from "passport";
import session from "express-session";
import config from "./config/config.js";
import { derserializer, localStart, serializer } from "./auth/passport.js";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./config/drizzle.js";
import { authRouter } from "./routers/authRouter.js";
import { strayRouteHandler } from "./middlewares/strayRouteHandler.js";

const PgSession = connectPgSimple(session);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("trust proxy", 1);

app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 2 * 7 * 24 * 60 * 60 * 1000, //2 weeks
      secure: config.ENV === "PROD" ? true : false,
      httpOnly: true,
    },
    store: new PgSession({ pool: pool, createTableIfMissing: true }),
  }),
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(localStart);
passport.serializeUser(serializer);
passport.deserializeUser(derserializer);

// connecting indivisual routers to the express routes

app.use("/api/auth", authRouter);

app.use(strayRouteHandler); // handles stray routes

export default app;
