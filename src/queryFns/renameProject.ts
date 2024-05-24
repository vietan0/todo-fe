import { resRenameProjectZ } from '../types/resSchemas';
import { devServer } from '../utils/serverUrl';

import type { Project, RenameProject } from '../types/dataSchemas';

export default async function renameProject(data: RenameProject, projectId: Project['id']): Promise<Project | null> {
  const res = await fetch(
    `${devServer}/api/project/${projectId}`,
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

  const validRes = resRenameProjectZ.parse(res);

  if (validRes.status === 'success')
    return validRes.data;

  return null;
}
