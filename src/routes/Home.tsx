import { Icon } from '@iconify/react/dist/iconify.js';
import { Button } from '@nextui-org/react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, Outlet } from 'react-router-dom';

import LoadingScreen from '../components/LoadingScreen';
import Sidebar from '../components/Sidebar';
import useUser from '../queries/useUser';

export default function Home() {
  const { data: user, isLoading } = useUser();
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);

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
      <Sidebar isSidebarHidden={isSidebarHidden} setIsSidebarHidden={setIsSidebarHidden} />
      <div className="grow">
        <div className="flex items-center justify-between p-2">
          {isSidebarHidden && (
            <Button
              isIconOnly
              aria-label="Toggle Sidebar"
              radius="sm"
              variant="light"
              className="p-0"
              onPress={() => setIsSidebarHidden(p => !p)}
            >
              <Icon icon="ph:sidebar-simple-fill" className="text-xl" />
            </Button>
          )}
          <Button
            isIconOnly
            aria-label="Toggle Sidebar"
            radius="sm"
            variant="light"
            className="ml-auto p-0"
          >
            <Icon icon="material-symbols:more-horiz" className="text-xl" />
          </Button>
        </div>
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
