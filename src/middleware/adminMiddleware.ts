import { NextFunction, Request, Response } from "express";
import CustomRequest from "../interfaces/customRequest";

const adminMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (req.user?.role === "Admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied" });
    return;
  }
};

export default adminMiddleware;
