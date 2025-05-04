import express from 'express';
import {createLink,
    deleteLink,
    updateLink,
    getUserLinks,
    getQRCode,
    fetchLinkPreview} from '../controllers/link.controller';
import { verifyJWT } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/create-link', verifyJWT, createLink);
router.delete('/delete-link/:linkId', verifyJWT, deleteLink);
router.put('/update-link/:linkId', verifyJWT, updateLink);
router.get('/user-links', verifyJWT, getUserLinks);
router.get('/qr-code/:username', getQRCode);
router.get('/link-preview', fetchLinkPreview as express.RequestHandler);

export default router;