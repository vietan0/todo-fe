import { useMutation, useQueryClient } from '@tanstack/react-query';

import { resDeleteTaskZ } from '../types/resSchemas';
import { server } from '../utils/serverUrl';

import type { Task } from '../types/dataSchemas';

export default function useDeleteTaskMutation(taskId: Task['id']) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteTask(taskId),
    onSuccess: async (task) => {
      await queryClient.invalidateQueries({ queryKey: ['getProject', task!.projectId] });
      queryClient.removeQueries({ queryKey: ['getTask', taskId] });
    },
  });
}

async function deleteTask(taskId: Task['id']): Promise<Task | null> {
  const res = await fetch(
    `${server}/api/task/${taskId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    },
  ).then(res => res.json());

  const validRes = resDeleteTaskZ.parse(res);

  if (validRes.status === 'success')
    return validRes.data;

  return null;
}
