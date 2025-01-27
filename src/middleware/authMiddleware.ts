import { NextFunction, Response } from "express";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import UserModel, { IUser } from "../models/user";
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
    const currentUser: IUser | null = await UserModel.findById(decoded.userId);
    if (currentUser) {
      req.user = {
        _id: currentUser._id as Types.ObjectId,
        email: currentUser.email,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        role: currentUser.role,
      };
      next();
    } else {
      res.status(400).json({ message: "Invalid user" });
    }
  } catch (error) {
    console.error("Error occured while parsing token", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
