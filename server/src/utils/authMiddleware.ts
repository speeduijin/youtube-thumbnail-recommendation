import { RequestHandler } from 'express';

const isLoggedIn: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ message: '사용자가 로그인하지 않았습니다.' });
  }
};

const isNotLoggedIn: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res
      .status(401)
      .json({ message: '로그인하지 않은 사용자만 접근 가능합니다.' });
  }
};

export { isLoggedIn, isNotLoggedIn };
