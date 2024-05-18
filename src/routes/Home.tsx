import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import useProjects from '../hooks/useProjects';
import useUser from '../hooks/useUser';

export default function Home() {
  const { data: user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('user', user);
    if (!user)
      navigate('/signin');
  }, [user]);

  const { data: projects } = useProjects();

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
        <pre>{JSON.stringify(projects, null, 2)}</pre>
      </div>
    </div>
  );
}
