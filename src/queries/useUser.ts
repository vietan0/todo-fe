import { useQuery } from '@tanstack/react-query';

import { resGetUserZ } from '../types/resSchemas';
import { server } from '../utils/serverUrl';

import type { User } from '../types/dataSchemas';

export default function useUser() {
  return useQuery({
    queryKey: ['getUser'],
    queryFn: getUser,
    retry: 0,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
}

async function getUser(): Promise<User | null> {
  const res = await fetch(
    `${server}/api/user`,
    { credentials: 'include' },
  ).then(res => res.json());

  const validRes = resGetUserZ.parse(res);

  if (validRes.status === 'success')
    return validRes.data;

  return null;
}
