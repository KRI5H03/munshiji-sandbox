import type { Request, Response, NextFunction } from "express";
import { verification, type JwtPayload } from "../utils/jwt.js";

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(400).json({ message: "Bad Request" });
    }

    const payload = await verification(token);
    console.log(payload);
    (req as AuthenticatedRequest).user = payload;
    next();
  } catch (e) {
    return res.status(403).json({ message: "Forbidden" });
  }
};
