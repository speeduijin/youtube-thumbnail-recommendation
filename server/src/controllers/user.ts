import { RequestHandler } from 'express';

const getInfo: RequestHandler = (req, res) => {
  const { user } = req;
  return res.json(user);
};

export default getInfo;
