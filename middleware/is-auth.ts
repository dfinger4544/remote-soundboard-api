import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default function (req: any, res: Response, next: NextFunction) {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      const error: any = new Error("Not authenticated");
      error.statusCode = 401;
      throw error;
    }
    const token = authHeader.split(" ")[1];
    const decodedToken: any = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    );
    if (!decodedToken || !decodedToken?.userId) {
      const error: any = new Error("Not authenticated");
      error.statusCode = 401;
      throw error;
    }

    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    next(err);
  }
}
