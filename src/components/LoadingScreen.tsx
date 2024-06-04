import { CircularProgress } from '@nextui-org/react';
import { Helmet } from 'react-helmet-async';

import viteLogo from '../assets/vite.svg';

export default function LoadingScreen({ withLogo }: { withLogo?: boolean } = { withLogo: true }) {
  return (
    <div id="LoadingScreen" className="flex h-screen w-full flex-col items-center justify-center">
      <Helmet>
        <title>Loading... – Todo App</title>
      </Helmet>
      { withLogo && <img src={viteLogo} alt="" className="mb-6 size-24" /> }
      <CircularProgress aria-label="Loading" />
    </div>
  );
}
