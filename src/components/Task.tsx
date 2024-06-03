import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Checkbox, CircularProgress, Code } from '@nextui-org/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useUpdateTaskMutation from '../queries/useUpdateTaskMutation';
import cn from '../utils/cn';
import TaskForm from './TaskForm';

import type { Task as TaskT } from '../types/dataSchemas';

export default function Task({ task, onOpen }: { task: TaskT; onOpen: () => void }) {
  const updateTaskMutation = useUpdateTaskMutation(task.id);
  const nav = useNavigate();
  const [isHover, setIsHover] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (isFormOpen) {
    return (
      <TaskForm
        mode="update"
        task={task}
        setIsFormOpen={setIsFormOpen}
        parentTaskId={undefined}
      />
    );
  }

  return (
    <Button
      onPress={() => {
        nav(`task/${task.id}`);
        onOpen();
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onFocus={() => setIsHover(true)}
      onBlur={() => setIsHover(false)}
      radius="sm"
      variant="bordered"
      disableAnimation
      className={cn(
        task.completed ? 'opacity-disabled' : 'hover:bg-default-100',
        'h-auto min-h-[55px] items-start justify-start p-3 text-start',
      )}
      endContent={isHover && (
        <div className="ml-auto flex gap-1.5">
          <Button
            onPress={() => setIsFormOpen(true)}
            isIconOnly
            aria-label="Edit Task"
            variant="light"
            radius="sm"
            size="sm"
            disableAnimation
            // eslint-disable-next-line tailwindcss/enforces-shorthand
            className="h-7 w-7 min-w-0 data-[hover=true]:bg-default/60"
          >
            <Icon icon="material-symbols:edit" className="text-xl text-default-700" />
          </Button>
          <Button
            isIconOnly
            aria-label="Delete Task"
            variant="light"
            radius="sm"
            size="sm"
            disableAnimation
            // eslint-disable-next-line tailwindcss/enforces-shorthand
            className="h-7 w-7 min-w-0 data-[hover=true]:bg-default/60"
          >
            <Icon icon="material-symbols:delete" className="text-xl text-default-700" />
          </Button>
        </div>
      )}
    >
      <Checkbox
        radius="full"
        id={task.id}
        classNames={{
          base: 'outline-1 outline-red-400',
          wrapper: 'mr-0',
        }}
        isSelected={task.completed}
        onValueChange={
          (isSelected: boolean) => {
            updateTaskMutation.mutate({ completed: isSelected });
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
      {updateTaskMutation.isPending && (
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
