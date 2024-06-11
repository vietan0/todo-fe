import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import deleteProject from './mutationFns/deleteProject';

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
