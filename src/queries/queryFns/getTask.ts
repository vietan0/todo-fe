import type { Task } from '../../types/dataSchemas';
import { resGetTaskZ } from '../../types/resSchemas';
import { sortByRank } from '../../utils/lexorank';
import { server } from '../../utils/serverUrl';

export default async function getTask(taskId: Task['id'] | undefined): Promise<Task> {
  const res = await fetch(
    `${server}/api/task/${taskId}`,
    { credentials: 'include' },
  ).then(res => res.json());

  const validRes = resGetTaskZ.parse(res);

  if (validRes.status === 'success') {
    const task = validRes.data;
    task.subTasks = sortByRank(task.subTasks);

    return task;
  }

  throw new Error(validRes.error || validRes.message);
}
