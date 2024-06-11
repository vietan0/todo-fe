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
    <div className="flex min-h-screen" data-testid="Home" id="Home">
      <Helmet>
        <title>
          Home – Todo App
        </title>
      </Helmet>
      <Sidebar isSidebarHidden={isSidebarHidden} setIsSidebarHidden={setIsSidebarHidden} />
      <div className="grow p-2">
        <div className="flex items-center justify-between">
          {isSidebarHidden && (
            <Button
              aria-label="Toggle Sidebar"
              className="p-0"
              isIconOnly
              onPress={() => setIsSidebarHidden(p => !p)}
              radius="sm"
              size="sm"
              variant="light"
            >
              <Icon className="text-xl" icon="ph:sidebar-simple-fill" />
            </Button>
          )}
          <Button
            aria-label="Toggle Sidebar"
            className="ml-auto p-0"
            isIconOnly
            radius="sm"
            size="sm"
            variant="light"
          >
            <Icon className="text-xl" icon="material-symbols:more-horiz" />
          </Button>
        </div>
        <div
          className="m-auto max-w-5xl px-8 py-4"
          data-testid="OutletContainer"
          id="OutletContainer"
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
