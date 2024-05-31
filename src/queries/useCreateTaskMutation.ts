import { useMutation, useQueryClient } from '@tanstack/react-query';

import { resCreateTaskZ } from '../types/resSchemas';
import { server } from '../utils/serverUrl';

import type { CreateTask, Project, Task } from '../types/dataSchemas';

export default function useCreateTaskMutation(projectId: Project['id']) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTask) => createTask(data, projectId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['getProjects'] });
    },
  });
}

async function createTask(data: CreateTask, projectId: Project['id']): Promise<Task | null> {
  const res = await fetch(
    `${server}/api/project/${projectId}/task`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    },
  ).then(res => res.json());

  const validRes = resCreateTaskZ.parse(res);

  if (validRes.status === 'success')
    return validRes.data;

  return null;
}
