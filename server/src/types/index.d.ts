import IUser from './user';

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

export {};
