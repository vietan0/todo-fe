import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';

import LoadingScreen from '../components/LoadingScreen';
import Sidebar from '../components/Sidebar';
import useUser from '../queries/useUser';

export default function Home() {
  const { data: user, isLoading } = useUser();

  if (isLoading)
    return <LoadingScreen />;

  else if (!user)
    return <Navigate to="/signin" />;

  return (
    <div id="Home" className="flex">
      <Helmet>
        <title>
          Home – Todo App
        </title>
      </Helmet>
      <Sidebar />
      <div className="p-4">
        <h1 className="text-4xl font-bold">Home</h1>
        <p>Projects</p>
      </div>
    </div>
  );
}
