import React from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import User from '../types/user';

const Root = () => {
  const userData = useOutletContext() as User;

  return (
    <>
      <Outlet context={userData} />
    </>
  );
};

export default Root;
