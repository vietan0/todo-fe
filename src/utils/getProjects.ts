import { getProjectsSchema } from '../types/schemas';
import { devServer } from './serverUrl';

import type { Project } from '../types/schemas';

export default async function getProjects(): Promise<Project[] | null> {
  const res = await fetch(
    `${devServer}/api/project`,
    { credentials: 'include' },
  ).then(res => res.json());

  const validRes = getProjectsSchema.parse(res);

  if (validRes.status === 'success')
    return validRes.data;

  return null;
}
