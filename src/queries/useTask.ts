import { useQuery } from '@tanstack/react-query';

import getTask from './queryFns/getTask';

import type { Task } from '../types/dataSchemas';

export default function useTask(taskId: Task['id'] | undefined) {
  return useQuery({
    queryKey: ['getTask', taskId],
    queryFn: () => getTask(taskId),
    retry: 0,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });
}
