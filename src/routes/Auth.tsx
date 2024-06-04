import { DevTool } from '@hookform/devtools';
import { Button, Card, CardBody, CardFooter, CardHeader, Input } from '@nextui-org/react';
import { Helmet } from 'react-helmet-async';
import { Controller, useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';

import LoadingScreen from '../components/LoadingScreen';
import QueryError from '../components/QueryError';
import useAuthMutation from '../queries/useAuthMutation';
import useUser from '../queries/useUser';

export interface AuthPayload {
  email: string;
  password: string;
}

export default function Auth({ mode }: { mode: 'signup' | 'signin' }) {
  const { data: user, isLoading, error } = useUser();
  const authMutation = useAuthMutation();

  const {
    handleSubmit,
    control,
  } = useForm<AuthPayload>({ defaultValues: {
    email: 'postman@gmail.com',
    password: 'postman',
  } });

  async function onSubmit(data: AuthPayload) {
    authMutation.mutate({ mode, data });
  }

  if (isLoading)
    return <LoadingScreen />;

  if (user)
    return <Navigate to="/" />;

  return (
    <div className="flex min-h-screen items-center">
      <Helmet>
        <title>
          {mode === 'signin' ? 'Sign In' : 'Sign Up'}
          {' '}
          – Todo App
        </title>
      </Helmet>
      <Card classNames={{
        base: 'm-auto max-w-screen-xs grow p-4',
      }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="mb-8 flex-col items-start">
            <p className="text-3xl font-bold">{mode === 'signin' ? 'Sign In' : 'Sign Up'}</p>
            {error && <QueryError error={error} queryName="useUser" />}
          </CardHeader>
          <CardBody className="flex flex-col gap-2">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value}
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                  autoFocus
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value}
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                />
              )}
            />
          </CardBody>
          <CardFooter>
            <Button
              type="submit"
              color="primary"
              className="font-bold"
              isLoading={authMutation.isPending}
            >
              {mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </Button>
          </CardFooter>
        </form>
        <DevTool control={control} />
      </Card>
    </div>
  );
}
