import type { Project } from '../types/dataSchemas';
import { useState } from 'react';
import RenameProjectForm from './RenameProjectForm';

export default function ProjectName({ project }: { project: Project }) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (isFormOpen) {
    return <RenameProjectForm project={project} setIsFormOpen={setIsFormOpen} />;
  }

  return (
    <div className="flex min-h-10 items-center px-1">
      <h1 className="text-2xl font-bold" onClick={() => setIsFormOpen(true)}>{project.name}</h1>
    </div>
  );
}
