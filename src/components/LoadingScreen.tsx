import { CircularProgress } from '@heroui/react';
import { Helmet } from 'react-helmet-async';

import viteLogo from '../assets/vite.svg';

export default function LoadingScreen({ withLogo }: { withLogo?: boolean } = { withLogo: true }) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center" id="LoadingScreen">
      <Helmet>
        <title>Loading... – Todo App</title>
      </Helmet>
      { withLogo && <img alt="" className="mb-6 size-24" src={viteLogo} /> }
      <CircularProgress aria-label="Loading" />
    </div>
  );
}
