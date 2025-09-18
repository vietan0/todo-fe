import type { Project } from '../../types/dataSchemas';
import { resDeleteProjectZ } from '../../types/resSchemas';
import { server } from '../../utils/serverUrl';

export default async function deleteProject(projectId: Project['id']): Promise<Project | null> {
  const res = await fetch(
    `${server}/api/project/${projectId}`,
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
