import type { Project } from '../types/dataSchemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import deleteProject from './mutationFns/deleteProject';

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
