import type { Task } from '../types/dataSchemas';
import { CircularProgress } from '@heroui/react';

export default function SubTaskCompletionCount({ task }: { task: Task }) {
  const completedSubCount = task.subTasks.filter(t => t.completed).length;
  const subCount = task.subTasks.length;

  if (subCount === 0)
    return;

  return (
    <div className="mt-1 flex items-center gap-1">
      <CircularProgress
        aria-label="Completion Count"
        classNames={{
          svg: 'size-4',
          indicator: 'stroke-primary',
          track: 'stroke-white/10',
        }}
        size="sm"
        strokeWidth={4}
        value={(completedSubCount / subCount) * 100}
      />
      <span className="text-xs text-default-500">
        {completedSubCount}
        /
        {subCount}
      </span>
    </div>
  );
}
