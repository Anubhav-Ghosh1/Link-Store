import express from "express";
import {
  login,
  signup,
  confirmUserAccount,
  getUserDetails,
  logout,
} from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/confirm-account", confirmUserAccount);
router.post("/logout", verifyJWT, logout);
router.get("/user-details", getUserDetails);

export default router;
