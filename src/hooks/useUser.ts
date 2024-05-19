import { useQuery } from '@tanstack/react-query';

import getUser from '../utils/getUser';

export default function useUser() {
  const query = useQuery({
    queryKey: ['getUser'],
    queryFn: getUser,
    retry: 0,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });

  return query;
}
