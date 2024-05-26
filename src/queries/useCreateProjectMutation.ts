import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { resCreateProjectZ } from '../types/resSchemas';
import { server } from '../utils/serverUrl';

import type { CreateProject, Project } from '../types/dataSchemas';

export default function useCreateProjectMutation() {
  const nav = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ['getProjects'] });
      nav(`/project/${newProject!.id}`);
    },
  });
}

async function createProject(data: CreateProject): Promise<Project | null> {
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
