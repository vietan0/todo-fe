import { useQuery } from '@tanstack/react-query';

import getProjects from '../utils/getProjects';

export default function useProjects() {
  const query = useQuery({
    queryKey: ['getProjects'],
    queryFn: getProjects,
    retry: 0,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });

  return query;
}
