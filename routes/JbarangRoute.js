import express from "express";
import {
  getJbarangs,
  getJbarangById,
  createJbarang,
  updateJbarang,
  deleteJbarang,
} from "../controllers/Jbarangs.js";

const router = express.Router();

router.get("/jbarangs", getJbarangs);
router.get("/jbarangs/:id", getJbarangById);
router.post("/jbarangs", createJbarang);
router.patch("/jbarangs/:id", updateJbarang);
router.delete("/jbarangs/:id", deleteJbarang);

export default router;
