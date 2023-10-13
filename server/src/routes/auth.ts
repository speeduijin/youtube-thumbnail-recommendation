import express from 'express';
import { join, login, logout, isNotLoggedIn } from '../controllers/auth';
import {
  isLoggedIn as mIsLoggedIn,
  isNotLoggedIn as mIsNotLoggedIn,
} from '../utils/authMiddleware';

const router = express.Router();

router.post('/join', mIsNotLoggedIn, join);

router.post('/login', mIsNotLoggedIn, login);

router.get('/logout', mIsLoggedIn, logout);

router.get('/isnotloggedin', isNotLoggedIn);

export default router;
