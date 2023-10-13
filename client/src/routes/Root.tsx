import React from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

const Root = () => {
  const isLoggedInData = useOutletContext() as boolean;

  return (
    <>
      <Outlet context={isLoggedInData} />
    </>
  );
};

export default Root;
