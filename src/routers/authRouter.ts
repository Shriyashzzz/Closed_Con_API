import { Router } from "express";
import passport from "passport";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { authLogin, authSignup } from "../controllers/authController.js";

export const authRouter = Router({ mergeParams: true });

authRouter.post("/login", passport.authenticate("local"), authLogin);
authRouter.post("/signUp", authSignup);
authRouter.get("/me", isAuthenticated); // sends 200 if client sends correct session id, 401 if unauthenticated
