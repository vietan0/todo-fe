import type { Task } from '../../types/dataSchemas';
import { resDeleteTaskZ } from '../../types/resSchemas';

import { server } from '../../utils/serverUrl';

export default async function deleteTask(taskId: Task['id']): Promise<Task | null> {
  const res = await fetch(
    `${server}/api/task/${taskId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    },
  ).then(res => res.json());

  const validRes = resDeleteTaskZ.parse(res);

  if (validRes.status === 'success')
    return validRes.data;

  return null;
}
