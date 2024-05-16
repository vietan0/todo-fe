import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import Nav from './components/Nav';

export default function App({ error }: { error?: React.ReactNode }) {
  useEffect(() => {
    const root = document.getElementById('root');
    if (root)
      root.role = 'presentation';
  }, []);

  return (
    <div className="m-auto min-h-screen w-screen max-w-screen-2xl" id="App">
      <h1 className="sr-only">Todo App - Made by Viet An</h1>
      <Nav />
      {error ?? (
        <Outlet />
      )}
    </div>
  );
}
