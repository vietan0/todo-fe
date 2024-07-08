import { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, Outlet } from 'react-router-dom';

import LoadingScreen from '../components/LoadingScreen';
import Sidebar from '../components/Sidebar';
import useUser from '../queries/useUser';

export interface OutletContext {
  mainRef: React.RefObject<HTMLDivElement>;
  isSidebarHidden: boolean;
  setIsSidebarHidden: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Home() {
  const { data: user, isLoading } = useUser();
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

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
      <main
        className="h-screen grow overflow-y-scroll" // overflow-y-scroll must be apply to this div specifically
        ref={mainRef}
      >
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
