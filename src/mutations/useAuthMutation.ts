import { useMutation, useQueryClient } from '@tanstack/react-query';

import { signIn, signUp } from './mutationFns/auth';

import type { AuthPayload } from '../types/dataSchemas';

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
