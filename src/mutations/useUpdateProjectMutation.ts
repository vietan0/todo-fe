import { useMutation, useQueryClient } from '@tanstack/react-query';

import updateProject from './mutationFns/updateProject';

import type { Project, UpdateProject } from '../types/dataSchemas';

export default function useUpdateProjectMutation(projectId: Project['id']) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProject) => updateProject(data, projectId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['getProjects'] });
      await queryClient.invalidateQueries({ queryKey: ['getProject', projectId] });
    },
  });
}
