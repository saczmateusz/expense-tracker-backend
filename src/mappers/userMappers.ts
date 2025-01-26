import { Types } from "mongoose";
import { IUserAdminDTO, IUserDTO } from "../dto/userDTO";
import { IUser } from "../models/user";

export const userToUserBasicDTO = (user: IUser): IUserDTO => ({
  _id: user._id as Types.ObjectId,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
});

export const userToUserAdminDTO = (user: IUser): IUserAdminDTO => ({
  ...userToUserBasicDTO(user),
  password: user.password,
});
