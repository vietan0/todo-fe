import { resGetProjectsZ } from '../types/resSchemas';
import { server } from '../utils/serverUrl';

import type { Project } from '../types/dataSchemas';

export default async function getProjects(): Promise<Project[] | null> {
  const res = await fetch(
    `${server}/api/project`,
    { credentials: 'include' },
  ).then(res => res.json());

  const validRes = resGetProjectsZ.parse(res);

  if (validRes.status === 'success')
    return validRes.data;

  return null;
}
