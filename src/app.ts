import express from "express";
import passport from "passport";
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("trusy proxy", 1);
app.use(passport.initialize());

export default app;
