import express from 'express';
import { random } from '../controllers/thumb';

const router = express.Router();

router.get('/random', random);

export default router;
