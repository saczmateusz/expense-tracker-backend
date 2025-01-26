import { NextFunction, Request, Response } from "express";
import UserModel from "../models/user";
import CustomRequest from "../interfaces/customRequest";

const adminMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const existingUser = await UserModel.findOne({ _id: req.userId });
  if (!existingUser) {
    res.status(400).json({ message: "Invalid user" });
    return;
  }

  if (existingUser.role === "Admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied" });
    return;
  }
};

export default adminMiddleware;
