import { resDeleteProjectZ } from '../types/resSchemas';
import { devServer } from '../utils/serverUrl';

import type { Project } from '../types/dataSchemas';

export default async function deleteProject(projectId: Project['id']): Promise<Project | null> {
  const res = await fetch(
    `${devServer}/api/project/${projectId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    },
  ).then(res => res.json());

  const validRes = resDeleteProjectZ.parse(res);

  if (validRes.status === 'success')
    return validRes.data;

  return null;
}
