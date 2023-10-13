import express from 'express';
import getInfo from '../controllers/user';

const router = express.Router();

router.get('/info', getInfo);

export default router;
