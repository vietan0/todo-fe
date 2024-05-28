import { Helmet } from 'react-helmet-async';
import { Navigate, Outlet } from 'react-router-dom';

import LoadingScreen from '../components/LoadingScreen';
import Sidebar from '../components/Sidebar';
import useUser from '../queries/useUser';

export default function Home() {
  const { data: user, isLoading } = useUser();

  if (isLoading)
    return <LoadingScreen withLogo />;

  else if (!user)
    return <Navigate to="/signin" />;

  return (
    <div id="Home" className="flex h-screen">
      <Helmet>
        <title>
          Home – Todo App
        </title>
      </Helmet>
      <Sidebar />
      <div className="grow p-8">
        <Outlet />
      </div>
    </div>
  );
}
