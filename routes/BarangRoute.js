import express from "express";
import {
  getBarangs,
  getBarangById,
  createBarang,
  updateBarang,
  deleteBarang,
} from "../controllers/Barangs.js";

const router = express.Router();

router.get("/barangs", getBarangs);
router.get("/barangs/:id", getBarangById);
router.post("/barangs", createBarang);
router.patch("/barangs/:id", updateBarang);
router.delete("/barangs/:id", deleteBarang);

export default router;
