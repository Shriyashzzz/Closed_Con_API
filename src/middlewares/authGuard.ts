import type { Request, Response, NextFunction } from "express";

// use this middleware for auth sensetive routes

const authGuard = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({
    error: {
      code: "Unauthorized",
      message: "User is not authenticated, please login",
    },
  });
};

export default authGuard;
