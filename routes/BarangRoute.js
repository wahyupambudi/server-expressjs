import express from "express";
import {
  getBarangs,
  getBarangById,
  createBarang,
  updateBarang,
  deleteBarang,
} from "../controllers/Barangs.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/barangs", verifyUser, getBarangs);
router.get("/barangs/:id", verifyUser, getBarangById);
router.post("/barangs", verifyUser, createBarang);
router.patch("/barangs/:id", verifyUser, updateBarang);
router.delete("/barangs/:id", verifyUser, deleteBarang);

export default router;
