import { useMutation, useQueryClient } from '@tanstack/react-query';

import { sortTasks } from '../utils/lexorank';
import updateTask from './mutationFns/updateTask';

import type { Project, Task, UpdateTask } from '../types/dataSchemas';

export default function useUpdateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, taskId }: { data: UpdateTask; taskId: Task['id'] }) => updateTask(data, taskId),
    onSettled: async (task) => {
      // refetch whether mutation succeed or error
      await queryClient.invalidateQueries({ queryKey: ['getProject', task!.projectId] });
      await queryClient.invalidateQueries({ queryKey: ['getTask', task!.id] });
    },
  });
}

export function optimisticUpdate(
  project: Project,
  data: UpdateTask,
  taskId: Task['id'],
) {
  const targetTask = project.tasks.find(t => t.id === taskId) as Task;
  const targetIndex = project.tasks.findIndex(t => t.id === taskId);
  const updatedTask = { ...targetTask, ...data };

  // replace target with updated
  project.tasks = [
    ...project.tasks.slice(0, targetIndex),
    updatedTask,
    ...project.tasks.slice(targetIndex + 1),
  ];

  // then sort by lexorank
  project.tasks = sortTasks(project.tasks);

  return project;
}
