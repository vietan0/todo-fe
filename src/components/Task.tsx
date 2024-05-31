import { Checkbox, Code } from '@nextui-org/react';

import useCompleteTaskMutation from '../queries/useCompleteTaskMutation';

import type { Task as TaskT } from '../types/dataSchemas';

export default function Task({ task }: { task: TaskT }) {
  const completeTaskMutation = useCompleteTaskMutation(task.id);

  return (
    <Checkbox
      radius="sm"
      id={task.id}
      classNames={{
        base: 'block max-w-full border border-default m-0 rounded-xl p-4',
      }}
      isSelected={task.completed}
      onValueChange={
        (isSelected: boolean) => {
          completeTaskMutation.mutate(isSelected);
        }
      }
    >
      {task.name}
      {task.parentTaskId
      && (
        <div>
          <span>
            parent:
            {' '}
          </span>
          <Code className="text-xs">{task.parentTaskId}</Code>
        </div>
      )}
    </Checkbox>
  );
}
