import { RequestHandler } from 'express';
import { random as randomService } from '../services/thumb';

const random: RequestHandler = async (req, res, next) => {
  try {
    const result = await randomService();

    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

const select: RequestHandler = (req, res) => {};

export { random, select };
