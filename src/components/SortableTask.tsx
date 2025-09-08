import type { TaskScalar, Task as TaskT } from '../types/dataSchemas';
import { useSortable } from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

import Task from './Task';

export default function SortableTask({
  deltaX,
  inModal = false,
  isOverlay = false,
  isTaskModalOpen,
  onTaskModalOpen,
  task,
}: {
  deltaX: number;
  inModal?: boolean;
  isOverlay?: boolean;
  isTaskModalOpen: boolean;
  onTaskModalOpen: () => void;
  task: TaskT | TaskScalar;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <Task
      attributes={attributes}
      deltaX={deltaX}
      inModal={inModal}
      isDragging={isDragging}
      isOverlay={isOverlay}
      isTaskModalOpen={isTaskModalOpen}
      listeners={listeners}
      onTaskModalOpen={onTaskModalOpen}
      ref={setNodeRef}
      style={style}
      task={task}
    />
  );
}
