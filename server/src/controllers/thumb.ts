import { RequestHandler } from 'express';
import randomService from '../services/thumb';

const random: RequestHandler = async (req, res, next) => {
  try {
    const result = await randomService();

    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

export default random;
