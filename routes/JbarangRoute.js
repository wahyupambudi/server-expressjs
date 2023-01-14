import express from "express";
import {
  getJbarangs,
  getJbarangById,
  createJbarang,
  updateJbarang,
  deleteJbarang,
} from "../controllers/Jbarangs.js";
import { verifyUser, ketuaJurusan } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/jbarangs", verifyUser, getJbarangs);
router.get("/jbarangs/:id", verifyUser, getJbarangById);
router.post("/jbarangs", verifyUser, ketuaJurusan, createJbarang);
router.patch("/jbarangs/:id", verifyUser, ketuaJurusan, updateJbarang);
router.delete("/jbarangs/:id", verifyUser, ketuaJurusan, deleteJbarang);

export default router;
