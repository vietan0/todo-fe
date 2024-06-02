import { useQuery } from '@tanstack/react-query';

import { resGetTaskZ } from '../types/resSchemas';
import { server } from '../utils/serverUrl';

import type { Project as Task } from '../types/dataSchemas';

export default function useTask(task: Task['id'] | undefined) {
  return useQuery({
    queryKey: ['getTask', task],
    queryFn: () => getTask(task),
    enabled: Boolean(task),
    retry: 0,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
}

async function getTask(taskId: Task['id'] | undefined): Promise<Task | null> {
  console.log('taskId', taskId);
  if (!taskId)
    return null;

  const res = await fetch(
    `${server}/api/task/${taskId}`,
    { credentials: 'include' },
  ).then(res => res.json());

  const validRes = resGetTaskZ.parse(res);

  if (validRes.status === 'success')
    return validRes.data;

  return null;
}
