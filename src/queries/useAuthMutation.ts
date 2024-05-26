import { useMutation, useQueryClient } from '@tanstack/react-query';

import { server } from '../utils/serverUrl';

import type { AuthPayload } from '../routes/Auth';

export default function useAuthMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      { mode, data }: { mode: 'signin' | 'signup'; data: AuthPayload }) => mode === 'signin' ? signIn(data) : signUp(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getUser'] });
    },
  });
}

export async function signIn(data: AuthPayload) {
  const res = await fetch(`${server}/auth/signin`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  }).then(res => res.json());

  return res;
}

export async function signUp(data: AuthPayload) {
  const res = await fetch(`${server}/auth/signup`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  }).then(res => res.json());

  return res;
}
