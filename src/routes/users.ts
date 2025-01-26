import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/UserController";

const router = Router();

router.post("/", createUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/", getUsers);
router.get("/:id", getUserById);

export default router;
