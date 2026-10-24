import type { Request, Response, NextFunction } from "express";

export const strayRouteHandler = (req: Request, res: Response) => {
  res.status(404).json({
    code: "Error",
    message: `Route not found: ${req.method} at: ${req.originalUrl}`,
  });
};
