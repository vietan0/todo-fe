import type { ProjectScalar } from '../../types/dataSchemas';
import { resGetProjectsZ } from '../../types/resSchemas';
import { sortByRank } from '../../utils/lexorank';

import { server } from '../../utils/serverUrl';

export default async function getProjects(): Promise<ProjectScalar[]> {
  const res = await fetch(
    `${server}/api/project`,
    { credentials: 'include' },
  ).then(res => res.json());

  const validRes = resGetProjectsZ.parse(res);

  if (validRes.status === 'success') {
    let projects = validRes.data;
    projects = sortByRank(projects);

    return projects;
  }

  throw new Error(validRes.error || validRes.message);
}
