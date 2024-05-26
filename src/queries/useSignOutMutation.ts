import { useMutation, useQueryClient } from '@tanstack/react-query';

import { server } from '../utils/serverUrl';

export default function useSignOutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getUser'] });
    },
  });
}

export async function signOut() {
  const res = await fetch(
    `${server}/auth/signout`,
    { method: 'POST', credentials: 'include' },
  ).then(res => res.json());

  return res;
}
