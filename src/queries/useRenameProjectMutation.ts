import { useMutation, useQueryClient } from '@tanstack/react-query';

import renameProject from '../queryFns/renameProject';

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
