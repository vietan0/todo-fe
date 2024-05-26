import { useMutation, useQueryClient } from '@tanstack/react-query';

import { resRenameProjectZ } from '../types/resSchemas';
import { server } from '../utils/serverUrl';

import type { Project, RenameProject } from '../types/dataSchemas';

export default function useRenameProjectMutation(projectId: Project['id']) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RenameProject) => renameProject(data, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getProjects'] });
    },
  });
}

async function renameProject(data: RenameProject, projectId: Project['id']): Promise<Project | null> {
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

  const validRes = resRenameProjectZ.parse(res);

  if (validRes.status === 'success')
    return validRes.data;

  return null;
}
