import type { Project } from '../../types/dataSchemas';
import { resGetProjectZ } from '../../types/resSchemas';
import { sortTasks } from '../../utils/lexorank';
import { server } from '../../utils/serverUrl';

export default async function getProject(projectId: Project['id'] | undefined): Promise<Project> {
  const res = await fetch(
    `${server}/api/project/${projectId}`,
    { credentials: 'include' },
  ).then(res => res.json());

  const validRes = resGetProjectZ.parse(res);

  if (validRes.status === 'success') {
    const project = validRes.data;
    project.tasks = sortTasks(project.tasks);

    return project;
  }

  throw new Error(validRes.error || validRes.message);
}
