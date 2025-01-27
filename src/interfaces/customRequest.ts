import { Request } from "express";
import { IUserDTO } from "../dto/userDTO";

export default interface CustomRequest extends Request {
  user?: IUserDTO;
}
