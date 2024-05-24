import { useMutation, useQueryClient } from '@tanstack/react-query';

import renameProject from '../queryFns/renameProject';

import type { Project, RenameProjectPayload } from '../types/schemas';

export default function useRenameProjectMutation(projectId: Project['id']) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RenameProjectPayload) => renameProject(data, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getProjects'] });
    },
  });
}
