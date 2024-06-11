import { useQuery } from '@tanstack/react-query';

import getProjects from './queryFns/getProjects';

export default function useProjects(userId: string | undefined) {
  return useQuery({
    queryKey: ['getProjects'],
    queryFn: getProjects,
    enabled: Boolean(userId),
    retry: 0,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
}
