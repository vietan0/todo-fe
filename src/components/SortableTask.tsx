import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import Task from './Task';

import type { Task as TaskT } from '../types/dataSchemas';

export default function SortableTask({ task, onTaskModalOpen }: { task: TaskT; onTaskModalOpen: () => void }) {
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
      isDragging={isDragging}
      listeners={listeners}
      onTaskModalOpen={onTaskModalOpen}
      ref={setNodeRef}
      style={style}
      task={task}
    />
  );
}
