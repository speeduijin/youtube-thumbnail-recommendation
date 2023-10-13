import React from 'react';
import { Navigate, Outlet, useLoaderData } from 'react-router-dom';

const Auth = () => {
  const message = useLoaderData() as string;

  return message === 'ok' ? (
    <main>
      <Outlet />
    </main>
  ) : (
    <Navigate to="/" />
  );
};

export default Auth;
