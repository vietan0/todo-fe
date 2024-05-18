import { useQuery } from '@tanstack/react-query';

import getProjects from '../utils/getProjects';

export default function useProjects() {
  const query = useQuery({
    queryKey: ['getProjects'],
    queryFn: getProjects,
  });

  return query;
}
