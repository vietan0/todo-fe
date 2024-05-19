import { Button } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { Link, useRouteError } from 'react-router-dom';

interface RouteError {
  data: string;
  error: Error;
  internal: boolean;
  status: number;
  statusText: string;
}

export default function ErrorPage() {
  const error = useRouteError() as RouteError;
  console.error(error);

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', duration: 0.5 }}
      className="flex min-h-screen justify-stretch px-8 py-16 xs:items-center xs:px-14 sm:px-20"
      data-testid="ErrorPage"
    >
      <div className="flex min-h-[400px] flex-1 flex-col gap-4">
        <div className="flex flex-wrap items-end gap-6">
          <span className="text-7xl font-bold">{error.status}</span>
          <span className="text-2xl">{error.statusText}</span>
        </div>
        <p>
          <span>Oops! An unexpected error has occurred.</span>
          <br />
          <code className="text-danger">{error.data}</code>
        </p>
        <Button
          variant="ghost"
          size="lg"
          color="primary"
          className="mt-4 block w-fit"
        >
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    </motion.div>
  );
}
