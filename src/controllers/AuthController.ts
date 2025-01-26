import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel, { IUser } from "../models/user";

const jwtSecret = process.env.JWT_SECRET || "";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, firstName, lastName } = req.body;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: IUser = new UserModel({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(400).json({ message: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: "1h" });
  res.status(200).json({ message: "Login successful", token });
};
