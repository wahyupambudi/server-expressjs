import express from "express";
import {
  getJbarangs,
  getJbarangById,
  createJbarang,
  updateJbarang,
  deleteJbarang,
} from "../controllers/Jbarangs.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/jbarangs", verifyUser, getJbarangs);
router.get("/jbarangs/:id", verifyUser, getJbarangById);
router.post("/jbarangs", verifyUser, createJbarang);
router.patch("/jbarangs/:id", verifyUser, updateJbarang);
router.delete("/jbarangs/:id", verifyUser, deleteJbarang);

export default router;
