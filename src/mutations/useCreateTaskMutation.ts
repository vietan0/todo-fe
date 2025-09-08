import type { CreateTask, Project } from '../types/dataSchemas';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import createTask from './mutationFns/createTask';

export default function useCreateTaskMutation(projectId: Project['id']) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTask) => createTask(data, projectId),
    onSuccess: async (task) => {
      await queryClient.invalidateQueries({ queryKey: ['getProject', projectId] });

      // also invalidate parent task (if any)
      if (task!.parentTaskId)
        await queryClient.invalidateQueries({ queryKey: ['getTask', task!.parentTaskId] });
    },
  });
}
