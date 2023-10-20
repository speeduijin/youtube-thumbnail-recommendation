import React from 'react';
import { Navigate, Outlet, useLoaderData } from 'react-router-dom';

const Auth = () => {
  const isNotLoggedIn = useLoaderData() as string;

  return isNotLoggedIn === 'ok' ? (
    <main>
      <Outlet />
    </main>
  ) : (
    <Navigate to="/" />
  );
};

export default Auth;
