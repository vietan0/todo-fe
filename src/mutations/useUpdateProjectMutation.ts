import type { Project, ProjectScalar, UpdateProject } from '../types/dataSchemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sortByRank } from '../utils/lexorank';
import updateProject from './mutationFns/updateProject';

export default function useUpdateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, projectId }: { data: UpdateProject; projectId: Project['id'] }) => updateProject(data, projectId),
    onSuccess: async (project) => {
      await queryClient.invalidateQueries({ queryKey: ['getProjects'] });
      await queryClient.invalidateQueries({ queryKey: ['getProject', project!.id] });
    },
  });
}

export function optimisticUpdate(
  projects: ProjectScalar[],
  data: UpdateProject,
  projectId: Project['id'],
) {
  const targetProject = projects.find(p => p.id === projectId) as ProjectScalar;
  const targetIndex = projects.findIndex(p => p.id === projectId);
  const updatedProject = { ...targetProject, ...data };

  // replace target with updated
  projects = [
    ...projects.slice(0, targetIndex),
    updatedProject,
    ...projects.slice(targetIndex + 1),
  ];

  // then sort by lexorank
  projects = sortByRank(projects);

  return projects;
}
