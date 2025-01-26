import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/UserController";
import authMiddleware from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";

const router = Router();

router.post("/", authMiddleware, adminMiddleware, createUser);
router.patch("/:id", authMiddleware, adminMiddleware, updateUser);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);
router.get("/", authMiddleware, getUsers);
router.get("/:id", authMiddleware, getUserById);

export default router;
