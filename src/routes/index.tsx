import App from '../App';
import Auth from './Auth';
import ErrorPage from './ErrorPage';
import Home from './Home';

export default [
  {
    path: '/',
    element: <App />,
    errorElement: <App error={<ErrorPage />} />,
    children: [
      { index: true, element: <Home /> },
      { path: '/signin', element: <Auth mode="signin" /> },
      { path: '/signup', element: <Auth mode="signup" /> },
    ],
  },
];
