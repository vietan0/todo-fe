import { Helmet } from '@dr.pogodin/react-helmet';
import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Navigate, Outlet } from 'react-router';

import LoadingScreen from '../components/LoadingScreen';
import Sidebar from '../components/Sidebar';
import useUser from '../queries/useUser';

export interface OutletContext {
  mainRef: React.RefObject<HTMLDivElement | null>;
  isSidebarHidden: boolean;
  setIsSidebarHidden: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Home() {
  const { data: user, isLoading } = useUser();
  const isMd = useMediaQuery({ query: '(min-width: 768px)' });
  const [isSidebarHidden, setIsSidebarHidden] = useState(!isMd);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsSidebarHidden(!isMd);
  }, [isMd]);

  if (isLoading)
    return <LoadingScreen withLogo />;

  else if (!user)
    return <Navigate to="/signin" />;

  return (
    <div className="relative flex min-h-screen" data-testid="Home" id="Home">
      <Helmet>
        <title>
          Home – Todo App
        </title>
      </Helmet>
      <Sidebar isSidebarHidden={isSidebarHidden} setIsSidebarHidden={setIsSidebarHidden} />
      <main
        className="h-screen grow overflow-y-scroll" // overflow-y-scroll must be apply to this div specifically
        ref={mainRef}
      >
        {!isMd && !isSidebarHidden && (
          <div
            className="fixed inset-0 z-[15] bg-black/50"
            id="SidebarOverlay"
            onClick={() => setIsSidebarHidden(true)}
          />
        )}

        <div
          className="m-auto max-w-5xl"
          id="OutletContainer"
        >
          <Outlet context={{ mainRef, isSidebarHidden, setIsSidebarHidden }} />
        </div>
      </main>
    </div>
  );
}
