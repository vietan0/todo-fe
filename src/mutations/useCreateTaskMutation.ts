import { useMutation, useQueryClient } from '@tanstack/react-query';

import createTask from './mutationFns/createTask';

import type { CreateTask, Project } from '../types/dataSchemas';

export default function useCreateTaskMutation(projectId: Project['id']) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTask) => createTask(data, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getProject', projectId] });
    },
  });
}
