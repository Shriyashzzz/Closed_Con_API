import type { Request } from "express";
import type { NextFunction, Response } from "express";

//ping this route when first opening the site/ when frontend needs to know if the user has valid session cookie in their browser

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({
      authenticated: true,
      user: { id: req.user.id, email: req.user.email },
    });
  } else {
    return res.status(401).json({ authenticated: false }); // for redundancy sake
  }
};

export default isAuthenticated;
