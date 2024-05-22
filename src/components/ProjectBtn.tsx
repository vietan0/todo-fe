import { Icon } from '@iconify/react/dist/iconify.js';
import { Button } from '@nextui-org/react';
import { useNavigate, useParams } from 'react-router-dom';

import cn from '../utils/cn';

import type { Project } from '../types/schemas';

export default function ProjectBtn({ project }: { project: Project }) {
  const nav = useNavigate();
  const params = useParams();
  const isProjectSelected = params.projectId === project.id;

  return (
    <Button
      onPress={() => {
        isProjectSelected || nav(`/project/${project.id}`);
      }}
      variant="light"
      fullWidth
      className={cn('justify-start', isProjectSelected && 'bg-default-100')}
      startContent={<Icon icon="material-symbols:category" className="text-lg" />}
      disableAnimation={isProjectSelected}
    >
      <p>{project.name}</p>
    </Button>
  );
}
