import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import Auth from './layouts/Auth';
import Default from './layouts/Default';
import Join from './routes/Join';
import Login from './routes/Login';
import Root from './routes/Root';
import Recommendation, { recommendationLoader } from './routes/Recommendation';
import { thumbsLoader } from './components/ThumbSelector';
import Error from './components/Error';
import { isNotLoggedIn, isLoggedIn } from './loaders';
import './styles/main.scss';

const rootElement = document.getElementById('root') as HTMLElement;
const root = createRoot(rootElement);

const router = createBrowserRouter([
  {
    element: <Default />,
    loader: isLoggedIn,
    children: [
      {
        path: '/',
        element: <Root />,
        errorElement: <Error />,
        loader: thumbsLoader,
      },
      {
        path: '/recommendation',
        element: <Recommendation />,
        errorElement: <Error />,
        loader: recommendationLoader,
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
