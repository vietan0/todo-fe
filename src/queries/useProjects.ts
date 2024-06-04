import { useQuery } from '@tanstack/react-query';

import { resGetProjectsZ } from '../types/resSchemas';
import { server } from '../utils/serverUrl';

import type { Project } from '../types/dataSchemas';

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

async function getProjects(): Promise<Project[]> {
  const res = await fetch(
    `${server}/api/project`,
    { credentials: 'include' },
  ).then(res => res.json());

  const validRes = resGetProjectsZ.parse(res);

  if (validRes.status === 'success')
    return validRes.data;

  throw new Error(validRes.error || validRes.message);
}
