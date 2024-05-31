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
    <div id="Home" className="flex min-h-screen">
      <Helmet>
        <title>
          Home – Todo App
        </title>
      </Helmet>
      <Sidebar isSidebarHidden={isSidebarHidden} setIsSidebarHidden={setIsSidebarHidden} />
      <div className="flex grow flex-col p-2">
        <div className="flex items-center justify-between">
          {isSidebarHidden && (
            <Button
              isIconOnly
              aria-label="Toggle Sidebar"
              size="sm"
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
            size="sm"
            radius="sm"
            variant="light"
            className="ml-auto p-0"
          >
            <Icon icon="material-symbols:more-horiz" className="text-xl" />
          </Button>
        </div>
        <div className="grow px-8 py-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
