import { Request, Response } from "express";
import bcrypt from "bcrypt";
import UserModel, { IUser } from "../models/user";
import CustomRequest from "../interfaces/customRequest";
import { IUserAdminDTO, IUserDTO } from "../dto/userDTO";
import { userToUserAdminDTO, userToUserBasicDTO } from "../mappers/userMappers";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user: IUser = new UserModel({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hashedPassword,
      role: "User",
    });

    const savedUser = await user.save();

    res.status(201).send({
      message: "User created successfully.",
      user: savedUser,
    });
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(500).send({
      message: error.message || "Some error occurred while creating the user.",
    });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (!id) {
      res.status(400).send({ message: "Invalid or missing user ID." });
      return;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true, // Returns the updated document
      runValidators: true, // Ensures validation rules in the schema are applied
    });

    if (!updatedUser) {
      res.status(404).send({ message: "User not found." });
      return;
    }

    res
      .status(200)
      .send({ message: "User updated successfully.", data: updatedUser });
  } catch (error: any) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .send({ message: error.message || "An unexpected error occurred." });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).send({ message: "Invalid or missing user ID." });
      return;
    }

    const deletedUser = await UserModel.findByIdAndDelete(id);
    if (!deletedUser) {
      res.status(404).send({ message: "User not found." });
      return;
    }

    res.status(200).send({ message: "User deleted successfully." });
  } catch (error: any) {
    res
      .status(500)
      .send({ message: error.message || "An unexpected error occurred." });
  }
};

export const getUsers = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const currentUser: IUser | null = await UserModel.findById(req.userId);
    const users: IUser[] = await UserModel.find();
    if (users.length === 0) {
      res.status(204).send();
    } else {
      if (currentUser && currentUser.role === "Admin") {
        const usersExtended: IUserAdminDTO[] = users.map((user) =>
          userToUserAdminDTO(user)
        );
        res.status(200).json(usersExtended);
      } else {
        const usersBasic: IUserDTO[] = users.map((user) =>
          userToUserBasicDTO(user)
        );
        res.status(200).json(usersBasic);
      }
    }
  } catch (error: any) {
    console.error("Error retrieving users:", error);
    res.status(500).json({
      message: error.message || "An error occurred while retrieving users.",
    });
  }
};

export const getUserById = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const currentUser: IUser | null = await UserModel.findById(req.userId);
    const user: IUser | null = await UserModel.findById(req.params.id);

    if (!user) {
      res
        .status(404)
        .json({ message: `User with ID ${req.params.id} not found.` });
      return;
    }

    if (currentUser && currentUser.role === "Admin") {
      const userExtended: IUserAdminDTO = userToUserAdminDTO(user);
      res.status(200).json(userExtended);
    } else {
      const userBasic: IUserDTO = userToUserBasicDTO(user);
      res.status(200).json(userBasic);
    }
  } catch (error: any) {
    console.error("Error retrieving user:", error);
    res.status(500).json({
      message: error.message || "An error occurred while retrieving the user.",
    });
  }
};
