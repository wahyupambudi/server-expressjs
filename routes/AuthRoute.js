import express from "express";
import { login, logout, sessi } from "../controllers/Auth.js";

const router = express.Router();

router.get("/sessi", sessi);
router.post("/login", login);
router.delete("/logout", logout);

export default router;
