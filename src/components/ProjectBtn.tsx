import { Button } from '@nextui-org/react';

import type { Project } from '../types/schemas';

export default function ProjectBtn({ project }: { project: Project }) {
  return (
    <Button
      variant="ghost"
      className="justify-start"
    >
      <p>{project.name}</p>
    </Button>
  );
}
