import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import LoadingScreen from '../components/LoadingScreen';
import Sidebar from '../components/Sidebar';
import useUser from '../hooks/useUser';

export default function Home() {
  const { data: user, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null)
      navigate('/signin');
  }, [user]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  else {
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
}
