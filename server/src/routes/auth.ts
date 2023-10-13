import express from 'express';
import { join, login, logout } from '../controllers/auth';
import { isLoggedIn, isNotLoggedIn } from '../utils/authMiddleware';

const router = express.Router();

router.post('/join', isNotLoggedIn, join);

router.post('/login', isNotLoggedIn, login);

router.get('/logout', isLoggedIn, logout);

export default router;
