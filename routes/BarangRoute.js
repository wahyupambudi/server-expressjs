import express from "express";
import {
  getBarangs,
  getBarangById,
  createBarang,
  updateBarang,
  deleteBarang,
} from "../controllers/Barangs.js";
import {
  verifyUser,
  ketuaJurusan,
  verifyToken,
} from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/barangs", verifyUser, verifyToken, getBarangs);
router.get("/barangs/:id", verifyUser, verifyToken, getBarangById);
router.post("/barangs", verifyUser, verifyToken, ketuaJurusan, createBarang);
router.patch(
  "/barangs/:id",
  verifyUser,
  verifyToken,
  ketuaJurusan,
  updateBarang
);
router.delete(
  "/barangs/:id",
  verifyUser,
  verifyToken,
  ketuaJurusan,
  deleteBarang
);

export default router;
