import { Button, Checkbox, CircularProgress, Code } from '@nextui-org/react';

import useCompleteTaskMutation from '../queries/useCompleteTaskMutation';
import cn from '../utils/cn';

import type { Task as TaskT } from '../types/dataSchemas';

export default function Task({ task }: { task: TaskT }) {
  const completeTaskMutation = useCompleteTaskMutation(task.id);

  return (
    <Button
      radius="sm"
      variant="bordered"
      disableAnimation
      className={cn(
        task.completed ? 'opacity-disabled' : 'hover:bg-default-100',
        'h-auto items-start justify-start p-4 text-start',
      )}
    >
      <Checkbox
        radius="sm"
        id={task.id}
        classNames={{
          base: 'outline-1 outline-red-400',
          wrapper: 'mr-0',
        }}
        isSelected={task.completed}
        onValueChange={
          (isSelected: boolean) => {
            completeTaskMutation.mutate(isSelected);
          }
        }
      />
      <div>
        <p>{task.name}</p>
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
      </div>
      {completeTaskMutation.isPending && (
        <CircularProgress
          aria-label="Loading"
          classNames={{
            base: 'self-center ml-auto',
            svg: 'w-5 h-5',
          }}
        />
      )}
    </Button>
  );
}
