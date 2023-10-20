import React from 'react';
import { Navigate, Outlet, useLoaderData, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GlobalHeader from '../components/GlobalHeader';
import { Message } from '../types';

const Default = () => {
  const isLoggedIn = useLoaderData() as string;

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get<Message>('/auth/logout');
      navigate('/login');
    } catch (error) {}
  };

  return isLoggedIn === 'ok' ? (
    <>
      <GlobalHeader handleLogout={handleLogout} />
      <main>
        <Outlet />
      </main>
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default Default;
