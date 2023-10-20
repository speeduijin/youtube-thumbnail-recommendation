import React from 'react';
import { useLoaderData } from 'react-router-dom';
import ThumbSelector from '../components/ThumbSelector';
import Thumb from '../types/thumb';

const Root = () => {
  const thumbsData = useLoaderData() as Thumb[];

  return (
    <>
      <ThumbSelector thumbsData={thumbsData} />
    </>
  );
};

export default Root;
