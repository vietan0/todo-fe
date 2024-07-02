import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import ProjectBtn from './ProjectBtn';

import type { ProjectScalar } from '../types/dataSchemas';

export default function SortableProjectBtn({
  isOverlay = false,
  project,
}: {
  isOverlay?: boolean;
  project: ProjectScalar;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <ProjectBtn
      attributes={attributes}
      isDragging={isDragging}
      isOverlay={isOverlay}
      listeners={listeners}
      project={project}
      ref={setNodeRef}
      style={style}
    />
  );
}
