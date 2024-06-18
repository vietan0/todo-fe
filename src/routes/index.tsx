import App from '../App';
import Auth from './Auth';
import ErrorPage from './ErrorPage';
import Home from './Home';
import NoProject from './NoProject';
import Project from './Project';

export default [
  {
    path: '/',
    element: <App />,
    errorElement: <App error={<ErrorPage />} />,
    children: [
      {
        path: '/',
        element: <Home />,
        children: [
          { index: true, element: <NoProject /> },
          {
            path: 'project/:projectId',
            element: <Project />,
            children: [
              { path: 'task/:taskId', element: null },
            ],
          },
        ],
      },
      { path: '/signin', element: <Auth mode="signin" /> },
      { path: '/signup', element: <Auth mode="signup" /> },
    ],
  },
];
