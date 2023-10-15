import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from 'react-router-dom';
import Auth from './layouts/Auth';
import Default, { userLoader } from './layouts/Default';
import Root from './routes/Root';
import Join from './routes/Join';
import Login from './routes/Login';
import ThumbSelector, { thumbLoader } from './components/ThumbSelector';
import Error from './components/Error';
import { isNotLoggedIn } from './loaders/auth';

import './styles/main.scss';
const rootElement = document.getElementById('root') as HTMLElement;
const root = createRoot(rootElement);

const router = createBrowserRouter([
  {
    element: <Default />,
    loader: userLoader,
    children: [
      {
        path: '/',
        element: <Root />,
        errorElement: <Error />,
        children: [
          { index: true, element: <ThumbSelector />, loader: thumbLoader },
        ],
      },
    ],
  },
  {
    element: <Auth />,
    errorElement: <Error />,
    loader: isNotLoggedIn,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/join', element: <Join /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
]);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
