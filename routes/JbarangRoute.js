import express from "express";
import {
  getJbarangs,
  getJbarangById,
  createJbarang,
  updateJbarang,
  deleteJbarang,
} from "../controllers/Jbarangs.js";
import {
  verifyUser,
  ketuaJurusan,
  verifyToken,
} from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/jbarangs", verifyUser, verifyToken, getJbarangs);
router.get("/jbarangs/:id", verifyUser, verifyToken, getJbarangById);
router.post("/jbarangs", verifyUser, verifyToken, ketuaJurusan, createJbarang);
router.patch(
  "/jbarangs/:id",
  verifyUser,
  verifyToken,
  ketuaJurusan,
  updateJbarang
);
router.delete(
  "/jbarangs/:id",
  verifyUser,
  verifyToken,
  ketuaJurusan,
  deleteJbarang
);

export default router;
