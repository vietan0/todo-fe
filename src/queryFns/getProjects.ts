import { resGetProjectsZ } from '../types/resSchemas';
import { devServer } from '../utils/serverUrl';

import type { Project } from '../types/dataSchemas';

export default async function getProjects(): Promise<Project[] | null> {
  const res = await fetch(
    `${devServer}/api/project`,
    { credentials: 'include' },
  ).then(res => res.json());

  const validRes = resGetProjectsZ.parse(res);

  if (validRes.status === 'success')
    return validRes.data;

  return null;
}
