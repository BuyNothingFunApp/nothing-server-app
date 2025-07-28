import express from 'express';
import { ShareController } from '../controllers/share.controller';


const router = express.Router();

const shareController = new ShareController();

router.post('/share', shareController.handleShare.bind(shareController));
router.post('/contact', shareController.handleContact.bind(shareController));

export default router;