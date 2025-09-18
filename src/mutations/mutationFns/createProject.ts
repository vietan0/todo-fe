import type { CreateProject, Project } from '../../types/dataSchemas';
import { resCreateProjectZ } from '../../types/resSchemas';
import { server } from '../../utils/serverUrl';

export default async function createProject(data: CreateProject): Promise<Project | null> {
  const res = await fetch(
    `${server}/api/project`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    },
  ).then(res => res.json());

  const validRes = resCreateProjectZ.parse(res);

  if (validRes.status === 'success')
    return validRes.data;

  return null;
}
