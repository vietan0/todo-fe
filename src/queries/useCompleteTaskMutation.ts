import { useMutation, useQueryClient } from '@tanstack/react-query';

import { resCompleteTaskZ } from '../types/resSchemas';
import { server } from '../utils/serverUrl';

import type { Task } from '../types/dataSchemas';

export default function useCompleteTaskMutation(taskId: Task['id']) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (completed: boolean) => completeTask(completed, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getProjects'] });
    },
  });
}

async function completeTask(completed: boolean, taskId: Task['id']): Promise<Task | null> {
  const res = await fetch(
    `${server}/api/task/${taskId}`,
    {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
      credentials: 'include',
    },
  ).then(res => res.json());

  const validRes = resCompleteTaskZ.parse(res);

  if (validRes.status === 'success')
    return validRes.data;

  return null;
}
