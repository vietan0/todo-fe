import type { Task } from '../types/dataSchemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useNavigate, useParams } from 'react-router';

import deleteTask from './mutationFns/deleteTask';

export default function useDeleteTaskMutation(taskId: Task['id']) {
  const nav = useNavigate();
  const params = useParams<'projectId' | 'taskId'>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteTask(taskId),
    onSuccess: async (task) => {
      await queryClient.invalidateQueries({ queryKey: ['getProject', task!.projectId] });
      queryClient.removeQueries({ queryKey: ['getTask', taskId] });
      // only redirect if current modal is for the task being deleted
      // that way it won't redirect if we're seeing the parent task or the project
      if (params.taskId === taskId)
        nav(`/project/${task!.projectId}`);
      // also invalidate parent task (if any)
      if (task!.parentTaskId)
        await queryClient.invalidateQueries({ queryKey: ['getTask', task!.parentTaskId] });
    },
  });
}
