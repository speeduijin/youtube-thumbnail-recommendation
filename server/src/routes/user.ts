import express from 'express';
import { select, recommendation } from '../controllers/user';
import { isLoggedIn } from '../utils/authMiddleware';

const router = express.Router();

router.post('/select', isLoggedIn, select);

router.get('/recommendation', isLoggedIn, recommendation);

export default router;
