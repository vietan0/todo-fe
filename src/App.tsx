import { useEffect } from 'react';
import { Outlet } from 'react-router';

export default function App({ error }: { error?: React.ReactNode }) {
  useEffect(() => {
    const root = document.getElementById('root');
    if (root)
      root.role = 'presentation';
  }, []);

  return (
    <div className="m-auto w-screen max-w-(--breakpoint-2xl)" id="App">
      {error ?? <Outlet />}
    </div>
  );
}
