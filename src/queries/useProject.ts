import { useQuery } from '@tanstack/react-query';

import getProject from './getProject';

import type { Project } from '../types/dataSchemas';

export default function useProject(projectId: Project['id'] | undefined) {
  return useQuery({
    queryKey: ['getProject', projectId],
    queryFn: () => getProject(projectId),
    retry: 0,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
}
