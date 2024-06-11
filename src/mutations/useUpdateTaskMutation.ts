import { useMutation, useQueryClient } from '@tanstack/react-query';

import updateTask from './mutationFns/updateTask';

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
