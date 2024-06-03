import { useMutation, useQueryClient } from '@tanstack/react-query';

import { resUpdateTaskZ } from '../types/resSchemas';
import { server } from '../utils/serverUrl';

import type { Task, UpdateTask } from '../types/dataSchemas';

export default function useUpdateTaskMutation(taskId: Task['id']) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTask) => updateTask(data, taskId),
    onSuccess: async (task) => {
      await queryClient.invalidateQueries({ queryKey: ['getProject', task!.projectId] });
      await queryClient.invalidateQueries({ queryKey: ['getTask', taskId] });
    },
  });
}

async function updateTask(data: UpdateTask, taskId: Task['id']): Promise<Task | null> {
  const res = await fetch(
    `${server}/api/task/${taskId}`,
    {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    },
  ).then(res => res.json());

  const validRes = resUpdateTaskZ.parse(res);

  if (validRes.status === 'success')
    return validRes.data;

  return null;
}
