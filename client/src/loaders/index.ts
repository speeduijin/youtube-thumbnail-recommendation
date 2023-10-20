import axios from 'axios';
import { Message } from '../types';

const isLoggedIn = async () => {
  try {
    const res = await axios.get<Message>('/auth/isLoggedIn');
    return res.data?.message;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data.message;
    }
  }
};

const isNotLoggedIn = async () => {
  try {
    const res = await axios.get<Message>('/auth/isNotLoggedIn');
    return res.data?.message;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data.message;
    }
  }
};

export { isLoggedIn, isNotLoggedIn };
