import { renameProjectSchema } from '../types/schemas';
import { devServer } from '../utils/serverUrl';

import type { Project, RenameProjectPayload } from '../types/schemas';

export default async function renameProject(data: RenameProjectPayload, projectId: Project['id']): Promise<Project | null> {
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

  const validRes = renameProjectSchema.parse(res);

  if (validRes.status === 'success')
    return validRes.data;

  return null;
}
