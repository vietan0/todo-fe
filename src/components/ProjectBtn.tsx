import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Link } from '@nextui-org/react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import cn from '../utils/cn';
import ProjectActionBtn from './ProjectActionBtn';

import type { Project } from '../types/dataSchemas';

export default function ProjectBtn({ project }: { project: Project }) {
  const nav = useNavigate();
  const params = useParams();
  const isProjectSelected = params.projectId === project.id;
  const [isHover, setIsHover] = useState(false);

  return (
    <Button
      as={Link}
      onPress={() => {
        isProjectSelected || nav(`/project/${project.id}`);
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onFocus={() => setIsHover(true)}
      onBlur={() => setIsHover(false)}
      variant="light"
      fullWidth
      className={cn('justify-start pl-2 pr-0', isProjectSelected && 'bg-default/40')}
      disableAnimation={isProjectSelected}
      startContent={<Icon icon="material-symbols:category" className="shrink-0 text-lg" />}
      endContent={<ProjectActionBtn project={project} isHover={isHover} />}
    >
      <p className="w-full overflow-hidden text-ellipsis text-left">{project.name}</p>
    </Button>
  );
}
