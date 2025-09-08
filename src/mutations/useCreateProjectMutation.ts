import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import createProject from './mutationFns/createProject';

export default function useCreateProjectMutation() {
  const nav = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: async (newProject) => {
      await queryClient.invalidateQueries({ queryKey: ['getProjects'] });
      nav(`/project/${newProject!.id}`);
    },
  });
}
