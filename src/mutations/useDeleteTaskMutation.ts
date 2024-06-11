import { useMutation, useQueryClient } from '@tanstack/react-query';

import deleteTask from './mutationFns/deleteTask';

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
