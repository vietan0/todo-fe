import { DevTool } from '@hookform/devtools';
import { Button } from '@nextui-org/button';
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { Input } from '@nextui-org/input';
import { Controller, useForm } from 'react-hook-form';

import { devServer } from './utils/serverUrl';

interface Inputs {
  email: string;
  password: string;
}

;

export default function Auth({ mode }: { mode: 'signup' | 'signin' }) {
  const {
    handleSubmit,
    control,
  } = useForm<Inputs>();

  async function onSubmit(data: Inputs) {
    const rawRes = await fetch(`${devServer}/auth/${mode}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    const res = await rawRes.json();

    if (res.status === 'success')
      localStorage.setItem('isLoggedIn', 'true');
  }

  return (
    <div className="flex min-h-screen items-center">
      <Card className="m-auto max-w-screen-xs grow p-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="mb-8 flex gap-3">
            <p className="text-3xl font-bold">{mode === 'signin' ? 'Sign In' : 'Sign Up'}</p>
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
            <Button type="submit" color="primary" className="font-bold">{mode === 'signin' ? 'Sign In' : 'Sign Up'}</Button>
          </CardFooter>
        </form>
        <DevTool control={control} />
      </Card>
    </div>
  );
}
