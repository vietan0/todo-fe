import { createProjectSchema } from '../types/schemas';
import { devServer } from '../utils/serverUrl';

import type { CreateProjectPayload, Project } from '../types/schemas';

export default async function createProject(data: CreateProjectPayload): Promise<Project | null> {
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

  const validRes = createProjectSchema.parse(res);

  if (validRes.status === 'success')
    return validRes.data;

  return null;
}
