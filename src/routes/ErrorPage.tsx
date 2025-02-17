import { Button } from '@heroui/react';
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
      animate={{ scale: 1, opacity: 1 }}
      className="flex min-h-screen justify-stretch px-8 py-16 xs:items-center xs:px-14 sm:px-20"
      data-testid="ErrorPage"
      initial={{ scale: 0.85, opacity: 0 }}
      transition={{ type: 'spring', duration: 0.5 }}
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
          className="mt-4 block w-fit"
          color="primary"
          size="lg"
          variant="ghost"
        >
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    </motion.div>
  );
}
