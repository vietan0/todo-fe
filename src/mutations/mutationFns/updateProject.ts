import type { Project, UpdateProject } from '../../types/dataSchemas';
import { resUpdateProjectZ } from '../../types/resSchemas';
import { server } from '../../utils/serverUrl';

export default async function updateProject(data: UpdateProject, projectId: Project['id']): Promise<Project | null> {
  const res = await fetch(
    `${server}/api/project/${projectId}`,
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

  const validRes = resUpdateProjectZ.parse(res);

  if (validRes.status === 'success')
    return validRes.data;

  return null;
}
