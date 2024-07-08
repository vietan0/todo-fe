import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

export default function App({ error }: { error?: React.ReactNode }) {
  useEffect(() => {
    const root = document.getElementById('root');
    if (root)
      root.role = 'presentation';
  }, []);

  return (
    <div className="m-auto w-screen max-w-screen-2xl" id="App">
      {error ?? <Outlet />}
    </div>
  );
}
