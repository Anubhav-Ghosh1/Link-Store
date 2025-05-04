import express from "express";
import { getUserInsights } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.get("/userData", verifyJWT, getUserInsights);

export default router;
