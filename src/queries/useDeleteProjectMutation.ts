import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { resDeleteProjectZ } from '../types/resSchemas';
import { server } from '../utils/serverUrl';

import type { Project } from '../types/dataSchemas';

export default function useDeleteProjectMutation(projectId: Project['id']) {
  const nav = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteProject(projectId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['getProjects'] });
      queryClient.removeQueries({ queryKey: ['getProject', projectId] });
      nav('/');
    },
  });
}

async function deleteProject(projectId: Project['id']): Promise<Project | null> {
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
