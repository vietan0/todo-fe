import { resCreateProjectZ } from '../types/resSchemas';
import { devServer } from '../utils/serverUrl';

import type { CreateProject, Project } from '../types/dataSchemas';

export default async function createProject(data: CreateProject): Promise<Project | null> {
  const res = await fetch(
    `${devServer}/api/project`,
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
