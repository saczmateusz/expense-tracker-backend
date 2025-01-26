import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";

const app = express();
const port = process.env.PORT || 3000;
const databaseUrl = process.env.DATABASE_URL || "";

app.use(express.json());

mongoose
  .connect(databaseUrl)
  .then(() => {
    console.log("Database connected.");
  })
  .catch((err) => {
    console.log("Could not connect to the database", err);
    process.exit();
  });

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Expense Tracking with TypeScript Express & MongoDB" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
