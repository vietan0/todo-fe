import { resGetProjectsZ } from '../types/resSchemas';
import { server } from '../utils/serverUrl';

import type { ProjectScalar } from '../types/dataSchemas';

export default async function getProjects(): Promise<ProjectScalar[]> {
  const res = await fetch(
    `${server}/api/project`,
    { credentials: 'include' },
  ).then(res => res.json());

  const validRes = resGetProjectsZ.parse(res);

  if (validRes.status === 'success')
    return validRes.data;

  throw new Error(validRes.error || validRes.message);
}
