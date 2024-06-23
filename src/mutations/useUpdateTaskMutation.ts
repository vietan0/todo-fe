import { useMutation, useQueryClient } from '@tanstack/react-query';

import updateTask from './mutationFns/updateTask';

import type { Task, UpdateTask } from '../types/dataSchemas';

export default function useUpdateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, taskId }: { data: UpdateTask; taskId: Task['id'] }) => updateTask(data, taskId),
    onSuccess: async (task) => {
      await queryClient.invalidateQueries({ queryKey: ['getProject', task!.projectId] });
      await queryClient.invalidateQueries({ queryKey: ['getTask', task!.id] });
    },
  });
}
