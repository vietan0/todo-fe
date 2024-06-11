import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, CardBody, CardFooter, CardHeader, Input } from '@nextui-org/react';
import { Helmet } from 'react-helmet-async';
import { Controller, useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';

import LoadingScreen from '../components/LoadingScreen';
import QueryError from '../components/QueryError';
import useAuthMutation from '../mutations/useAuthMutation';
import useUser from '../queries/useUser';
import { authPayloadZ } from '../types/dataSchemas';

import type { AuthPayload } from '../types/dataSchemas';

export default function Auth({ mode }: { mode: 'signup' | 'signin' }) {
  const { data: user, isLoading, error } = useUser();
  const authMutation = useAuthMutation();

  const {
    handleSubmit,
    control,
    formState,
  } = useForm<AuthPayload>({
    defaultValues: {
      email: 'postman@gmail.com',
      password: 'postman',
    },
    resolver: zodResolver(authPayloadZ),
  });

  async function onSubmit(data: AuthPayload) {
    authMutation.mutate({ mode, data });
  }

  if (isLoading)
    return <LoadingScreen />;

  if (user)
    return <Navigate to="/" />;

  return (
    <div
      className="flex min-h-screen items-center"
      data-testid="Auth"
    >
      <Helmet>
        <title>
          {mode === 'signin' ? 'Sign In' : 'Sign Up'}
          {' '}
          – Todo App
        </title>
      </Helmet>
      <Card classNames={{
        base: 'm-auto max-w-screen-xs grow p-4',
        footer: 'flex-col items-stretch gap-2',
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
                  isInvalid={Boolean(formState.errors.email)}
                  errorMessage={formState.errors.email?.message}
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
                  isInvalid={Boolean(formState.errors.password)}
                  errorMessage={formState.errors.password?.message}
                />
              )}
            />
          </CardBody>
          <CardFooter>
            <div className="flex justify-end gap-2">
              <Button
                type="submit"
                color="primary"
                className="font-bold"
                isLoading={authMutation.isPending}
              >
                {mode === 'signin' ? 'Sign In' : 'Sign Up'}
              </Button>
            </div>
            {authMutation.isError
              ? (
                <p onClick={() => authMutation.reset()} className="font-mono text-sm text-danger" data-testid="MutationError">
                  An error occurred while
                  {' '}
                  {mode === 'signin' ? 'signing in' : 'signing up'}
                  :
                  {' '}
                  {authMutation.error.message}
                </p>
                )
              : null}
          </CardFooter>
        </form>
        <DevTool control={control} />
      </Card>
    </div>
  );
}
