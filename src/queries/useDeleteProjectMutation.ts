import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import deleteProject from '../queryFns/deleteProject';

import type { Project } from '../types/schemas';

export default function useDeleteProjectMutation(projectId: Project['id']) {
  const nav = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteProject(projectId),
    onSuccess: (_deletedProject) => {
      queryClient.invalidateQueries({ queryKey: ['getProjects'] });
      nav('/');
    },
  });
}
