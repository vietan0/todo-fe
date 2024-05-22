import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import createProject from '../queryFns/createProject';

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
