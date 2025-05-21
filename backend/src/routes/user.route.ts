import express from "express";
import {
  login,
  updateProfilePicture,
  signup,
  confirmUserAccount,
  getUserDetails,
  logout,
} from "../controllers/user.controller";
import { upload } from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post(
  "/create-link",
  verifyJWT,
  upload.fields([
    // name should be same in frontend also
    { name: "avatar", maxCount: 1 },
  ]),
  updateProfilePicture
);
router.get("/confirm-account", confirmUserAccount);
router.post("/logout", verifyJWT, logout);
router.get("/user-details", verifyJWT, getUserDetails);

export default router;
