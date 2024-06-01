import { useQuery } from '@tanstack/react-query';

import { resGetTasksZ } from '../types/resSchemas';
import { server } from '../utils/serverUrl';

import type { Project, Task } from '../types/dataSchemas';

export default function useTasks(projectId: Project['id'] | undefined) {
  return useQuery({
    queryKey: ['getTasks', projectId],
    queryFn: () => getTasks(projectId),
    enabled: Boolean(projectId),
    retry: 0,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
}

async function getTasks(projectId: Project['id'] | undefined): Promise<Task[] | null> {
  const res = await fetch(
    `${server}/api/project/${projectId}/task`,
    { credentials: 'include' },
  ).then(res => res.json());

  const validRes = resGetTasksZ.parse(res);

  if (validRes.status === 'success')
    return validRes.data;

  return null;
}
