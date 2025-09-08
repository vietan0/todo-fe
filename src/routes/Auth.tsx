import type { AuthPayload } from '../types/dataSchemas';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Button, Card, CardBody, CardFooter, CardHeader, Input } from '@heroui/react';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { Navigate } from 'react-router';
import LoadingScreen from '../components/LoadingScreen';
import MutationError from '../components/MutationError';
import useAuthMutation from '../mutations/useAuthMutation';
import useUser from '../queries/useUser';
import { authPayloadZ } from '../types/dataSchemas';

import cn from '../utils/cn';

export default function Auth({ mode }: { mode: 'signup' | 'signin' }) {
  const { data: user, isLoading } = useUser();
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
        base: cn('m-auto max-w-(--breakpoint-xs) grow p-4'),
        footer: cn('flex-col items-stretch gap-2'),
      }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="mb-8 flex-col items-start">
            <h1 className="text-3xl font-bold">{mode === 'signin' ? 'Sign In' : 'Sign Up'}</h1>
          </CardHeader>
          <CardBody className="flex flex-col gap-2">
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Input
                  {...field}
                  autoFocus
                  errorMessage={formState.errors.email?.message}
                  isInvalid={Boolean(formState.errors.email)}
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                  value={field.value}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <Input
                  {...field}
                  errorMessage={formState.errors.password?.message}
                  isInvalid={Boolean(formState.errors.password)}
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  value={field.value}
                />
              )}
            />
          </CardBody>
          <CardFooter>
            <div className="flex justify-end gap-2">
              <Button
                className="font-bold"
                color="primary"
                isLoading={authMutation.isPending}
                type="submit"
              >
                {mode === 'signin' ? 'Sign In' : 'Sign Up'}
              </Button>
            </div>
            {authMutation.error
              && (
                <MutationError
                  error={authMutation.error}
                  mutationName="auth"
                />
              )}
          </CardFooter>
        </form>
        {import.meta.env.PROD || <DevTool control={control} />}
      </Card>
    </div>
  );
}
