import { NextFunction, Response } from "express";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import CustomRequest from "../interfaces/customRequest";

interface JwtPayload {
  userId: Types.ObjectId;
}

const jwtSecret = process.env.JWT_SECRET || "";

const authMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers["authorization"]?.split(" ")?.[1];

  if (!token) {
    res.status(401).json({ message: "Access denied" });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    req.userId = decoded.userId as Types.ObjectId;
    next();
  } catch (error) {
    console.error("Error occured while parsing token", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
