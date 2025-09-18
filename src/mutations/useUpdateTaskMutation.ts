import type { Project, Task, TaskScalar, UpdateTask } from '../types/dataSchemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sortByRank, sortTasks } from '../utils/lexorank';
import updateTask from './mutationFns/updateTask';

export default function useUpdateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, taskId }: { data: UpdateTask; taskId: Task['id'] }) => updateTask(data, taskId),
    onSettled: async (task) => {
      // refetch whether mutation succeed or error
      await queryClient.invalidateQueries({ queryKey: ['getProject', task!.projectId] });
      await queryClient.invalidateQueries({ queryKey: ['getTask', task!.id] });
      // also invalidate parent task (if any)
      if (task!.parentTaskId)
        await queryClient.invalidateQueries({ queryKey: ['getTask', task!.parentTaskId] });
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

export function optimisticUpdateSubTask(
  parent: Task,
  data: UpdateTask,
  taskId: Task['id'],
) {
  const targetSubTask = parent.subTasks.find(t => t.id === taskId) as TaskScalar;
  const targetIndex = parent.subTasks.findIndex(t => t.id === taskId);
  const updatedSubTask = { ...targetSubTask, ...data };

  // replace target with updated
  parent.subTasks = [
    ...parent.subTasks.slice(0, targetIndex),
    updatedSubTask,
    ...parent.subTasks.slice(targetIndex + 1),
  ];

  // then sort by lexorank
  parent.subTasks = sortByRank(parent.subTasks);

  return parent;
}
