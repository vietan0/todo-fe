import { useQuery } from '@tanstack/react-query';

import { resGetProjectZ } from '../types/resSchemas';
import { server } from '../utils/serverUrl';

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

async function getProject(projectId: Project['id'] | undefined): Promise<Project | null> {
  const res = await fetch(
    `${server}/api/project/${projectId}`,
    { credentials: 'include' },
  ).then(res => res.json());

  const validRes = resGetProjectZ.parse(res);

  if (validRes.status === 'success')
    return validRes.data;

  return null;
}
