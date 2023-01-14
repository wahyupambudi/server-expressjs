import express from "express";
import {
  getBarangs,
  getBarangById,
  createBarang,
  updateBarang,
  deleteBarang,
} from "../controllers/Barangs.js";
import { verifyUser, ketuaJurusan } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/barangs", verifyUser, getBarangs);
router.get("/barangs/:id", verifyUser, getBarangById);
router.post("/barangs", verifyUser, ketuaJurusan, createBarang);
router.patch("/barangs/:id", verifyUser, ketuaJurusan, updateBarang);
router.delete("/barangs/:id", verifyUser, ketuaJurusan, deleteBarang);

export default router;
