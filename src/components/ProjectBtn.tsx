import { Button } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';

import type { Project } from '../types/schemas';

export default function ProjectBtn({ project }: { project: Project }) {
  const nav = useNavigate();

  return (
    <Button
      variant="ghost"
      className="justify-start"
      onPress={() => {
        nav(`/project/${project.id}`);
      }}
    >
      <p>{project.name}</p>
    </Button>
  );
}
