import { Types } from "mongoose";

export interface IUserDTO {
  _id: Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface IUserAdminDTO extends IUserDTO {
  password: string;
}
