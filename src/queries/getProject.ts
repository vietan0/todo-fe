import { resGetProjectZ } from '../types/resSchemas';
import { server } from '../utils/serverUrl';

import type { Project } from '../types/dataSchemas';

export default async function getProject(projectId: Project['id'] | undefined): Promise<Project> {
  const res = await fetch(
    `${server}/api/project/${projectId}`,
    { credentials: 'include' },
  ).then(res => res.json());

  const validRes = resGetProjectZ.parse(res);

  if (validRes.status === 'success')
    return validRes.data;

  throw new Error(validRes.error || validRes.message);
}
