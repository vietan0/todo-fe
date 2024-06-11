import { resGetTaskZ } from '../../types/resSchemas';
import { server } from '../../utils/serverUrl';

import type { Task } from '../../types/dataSchemas';

export default async function getTask(taskId: Task['id'] | undefined): Promise<Task> {
  const res = await fetch(
    `${server}/api/task/${taskId}`,
    { credentials: 'include' },
  ).then(res => res.json());

  const validRes = resGetTaskZ.parse(res);

  if (validRes.status === 'success')
    return validRes.data;

  throw new Error(validRes.error || validRes.message);
}
