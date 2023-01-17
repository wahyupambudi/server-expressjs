import express from "express";
import { refreshToken } from "../controllers/RefreshToken.js";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/Users.js";

// verifyuser digunakan untuk middleware
import { verifyUser, adminOnly, verifyToken } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/users", verifyUser, adminOnly, verifyToken, getUsers);
router.get("/users/:id", verifyUser, adminOnly, verifyToken, getUserById);
router.post("/users", verifyUser, adminOnly, verifyToken, createUser);
router.patch("/users/:id", verifyUser, adminOnly, verifyToken, updateUser);
router.delete("/users/:id", verifyUser, adminOnly, verifyToken, deleteUser);
router.get("/token", refreshToken);

export default router;
