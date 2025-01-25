import express, { Request, Response } from "express";
import userRoutes from "./routes/users";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/users", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Expense Tracking with TypeScript Express & MongoDB" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
