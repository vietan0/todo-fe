import { type Project, deleteProjectSchema } from '../types/schemas';
import { devServer } from '../utils/serverUrl';

export default async function deleteProject(projectId: Project['id']): Promise<Project | null> {
  const res = await fetch(
    `${devServer}/api/project/${projectId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    },
  ).then(res => res.json());

  const validRes = deleteProjectSchema.parse(res);

  if (validRes.status === 'success')
    return validRes.data;

  return null;
}
