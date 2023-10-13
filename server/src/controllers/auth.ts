import { RequestHandler } from 'express';
import passport from 'passport';
import serviceJoin from '../services/auth';

const resMap = {
  invalidEmail: {
    status: 400,
    message: '올바른 이메일 주소를 입력하세요.',
  },
  invalidPassword: {
    status: 400,
    message:
      '비밀번호는 최소 8자 이상이며, 대문자, 소문자, 숫자를 포함해야 합니다.',
  },
  exUser: { status: 401, message: '이미 회원 가입된 이메일 주소입니다.' },
  noUser: { status: 401, message: '가입되지 않은 회원입니다.' },
  incorrectPassword: { status: 401, message: '비밀번호가 일치하지 않습니다.' },
  successJoin: { status: 201, message: '회원 가입이 완료되었습니다.' },
};

const join: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await serviceJoin(email, password);

    const { status, message } = resMap[result];

    return res.status(status).json({ message });
  } catch (error) {
    return next(error);
  }
};

const login: RequestHandler = (req, res, next) => {
  passport.authenticate(
    'local',
    (
      authError: any,
      user: Express.User,
      info: {
        message:
          | 'invalidEmail'
          | 'invalidPassword'
          | 'noUser'
          | 'incorrectPassword';
      },
    ) => {
      if (authError) return next(authError);

      if (!user) {
        const { status, message } = resMap[info.message];

        return res.status(status).json({ message });
      }

      return req.login(user, (loginError) => {
        if (loginError) return next(loginError);

        return res.json({ message: 'Login successful.' });
      });
    },
  )(req, res, next);
};

const logout: RequestHandler = (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logout successful.' });
  });
};

const isNotLoggedIn: RequestHandler = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.json({ message: 'ok' });
  }

  return res
    .status(401)
    .json({ message: '로그인하지 않은 사용자만 접근 가능합니다.' });
};

export { join, login, logout, isNotLoggedIn };
