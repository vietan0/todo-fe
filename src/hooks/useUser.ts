import { useQuery } from '@tanstack/react-query';

import getUser from '../utils/getUser';

export default function useUser() {
  const query = useQuery({
    queryKey: ['getUser'],
    queryFn: getUser,
  });

  return query;
}
