import type { Project } from '../types/dataSchemas';
import { useQuery } from '@tanstack/react-query';
import getProject from './queryFns/getProject';

export default function useProject(projectId: Project['id'] | undefined) {
  return useQuery({
    queryKey: ['getProject', projectId],
    queryFn: () => getProject(projectId),
    retry: 0,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
}
