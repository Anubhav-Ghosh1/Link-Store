import express from "express";
import {
  createLink,
  deleteLink,
  updateLink,
  getUserLinks,
  getQRCode,
  fetchLinkPreview,
} from "../controllers/link.controller";
import { upload } from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = express.Router();

router.post(
  "/create-link",
  verifyJWT,
  upload.fields([
        // name should be same in frontend also
        { name: "logo", maxCount: 1 },
    ]
  ),
  createLink
);
router.delete("/delete-link/:linkId", verifyJWT, deleteLink);
router.put("/update-link/:linkId", verifyJWT, updateLink);
router.get("/user-links/:username", getUserLinks);
router.get("/qr-code/:username", getQRCode);
router.get("/link-preview", fetchLinkPreview);

export default router;
