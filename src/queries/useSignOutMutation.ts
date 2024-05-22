import { useMutation, useQueryClient } from '@tanstack/react-query';

import { signOut } from '../queryFns/auth';

export default function useSignOutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getUser'] });
    },
  });
}
