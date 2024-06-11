import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Link } from '@nextui-org/react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import cn from '../utils/cn';
import ProjectActionBtn from './ProjectActionBtn';

import type { ProjectScalar } from '../types/dataSchemas';

export default function ProjectBtn({ project }: { project: ProjectScalar }) {
  const nav = useNavigate();
  const params = useParams<'projectId' | 'taskId'>();
  const isProjectSelected = params.projectId === project.id;
  const [isHover, setIsHover] = useState(false);

  return (
    <Button
      as={Link}
      className={cn('justify-start pl-2 pr-0', isProjectSelected && 'bg-default/40')}
      disableAnimation={isProjectSelected}
      endContent={<ProjectActionBtn isHover={isHover} project={project} />}
      fullWidth
      onBlur={() => setIsHover(false)}
      onFocus={() => setIsHover(true)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onPress={() => {
        isProjectSelected || nav(`/project/${project.id}`);
      }}
      radius="sm"
      startContent={<Icon className="shrink-0 text-lg" icon="material-symbols:category" />}
      variant="light"
    >
      <p className="w-full overflow-hidden text-ellipsis text-left">{project.name}</p>
    </Button>
  );
}
