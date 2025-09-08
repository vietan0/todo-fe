import type { Task, UpdateTask } from '../../types/dataSchemas';
import { resUpdateTaskZ } from '../../types/resSchemas';

import { server } from '../../utils/serverUrl';

export default async function updateTask(data: UpdateTask, taskId: Task['id']): Promise<Task | null> {
  const res = await fetch(
    `${server}/api/task/${taskId}`,
    {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    },
  ).then(res => res.json());

  const validRes = resUpdateTaskZ.parse(res);

  if (validRes.status === 'success')
    return validRes.data;

  return null;
}
