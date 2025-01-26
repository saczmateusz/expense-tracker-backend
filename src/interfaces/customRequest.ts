import { Request } from "express";
import { Types } from "mongoose";

export default interface CustomRequest extends Request {
  userId?: Types.ObjectId;
}
