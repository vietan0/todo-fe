import { useQuery } from '@tanstack/react-query';

import getUser from './queryFns/getUser';

export default function useUser() {
  return useQuery({
    queryKey: ['getUser'],
    queryFn: getUser,
    retry: 0,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
}
