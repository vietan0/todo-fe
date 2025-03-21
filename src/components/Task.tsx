/* eslint-disable tailwindcss/enforces-shorthand */
import { Checkbox, CircularProgress, Code } from '@heroui/react';
import { forwardRef, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useUpdateTaskMutation from '../mutations/useUpdateTaskMutation';
import { indent } from '../utils/calcRank';
import cn from '../utils/cn';
import CustomMarkdown from './CustomMarkdown';
import DeleteTaskButton from './DeleteTaskButton';
import MutationError from './MutationError';
import TaskForm from './TaskForm';
import UpdateTaskButton from './UpdateTaskButton';

import type { TaskScalar, Task as TaskT } from '../types/dataSchemas';
import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import type { HTMLAttributes } from 'react';

type Props = Omit<HTMLAttributes<HTMLAnchorElement>, 'id'> & {
  deltaX: number;
  task: TaskT | TaskScalar;
  inModal: boolean;
  isTaskModalOpen: boolean;
  onTaskModalOpen: () => void;
  isDragging: boolean;
  isOverlay: boolean;
  attributes: DraggableAttributes ;
  listeners: SyntheticListenerMap | undefined ;
  style: {
    transform: string | undefined;
    transition: string | undefined;
  };
};

const Task = forwardRef<HTMLAnchorElement, Props>(({
  deltaX,
  task,
  inModal,
  isTaskModalOpen,
  onTaskModalOpen,
  isDragging,
  isOverlay,
  attributes,
  listeners,
  style,
  ...props
}, ref) => {
  const updateTaskMutation = useUpdateTaskMutation();
  const nav = useNavigate();
  const [isHover, setIsHover] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const childrenCount = 'subTasks' in task ? task.subTasks.length : 0;

  const finalIndent = useMemo(() => {
    // based on task level, deltaX, inModal & isDragging
    if (inModal)
      return 0;

    if (!isDragging)
      return task.parentTaskId ? indent : 0;

    // when dragging
    if (task.parentTaskId === null)
      return deltaX > indent ? indent : 0;

    else
      return deltaX < -indent ? 0 : indent;
  }, [task.parentTaskId, deltaX, inModal, isDragging]);

  function handleClick() {
    nav(`task/${task.id}`);
    // if already open, don't call onOpen
    if (!isTaskModalOpen)
      onTaskModalOpen();
  }

  if (isFormOpen) {
    return (
      <TaskForm
        finalIndent={finalIndent}
        mode="update"
        parentTaskId={undefined}
        setIsFormOpen={setIsFormOpen}
        task={task}
      />
    );
  }

  return (
    <a
      ref={ref}
      {...attributes}
      {...listeners}
      {...props}
      className={cn(
        task.completed ? 'opacity-disabled' : 'hover:bg-default-100 hover:opacity-hover focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        'h-auto min-h-[55px] shrink-0 items-start justify-start border border-default bg-default-50 p-3 text-start text-sm',
        'group relative z-0 box-border inline-flex min-w-20 select-none appearance-none gap-2 whitespace-nowrap rounded-lg font-normal text-foreground no-underline subpixel-antialiased tap-highlight-transparent active:opacity-disabled [&>svg]:max-w-[theme(spacing.8)]',
        isDragging && 'before:absolute before:-left-2.5 before:-top-3 before:ml-0.5 before:size-3 before:rounded-full before:border-3 before:border-primary',
        isDragging && 'after:absolute after:-top-2 after:left-0 after:ml-0.5 after:h-0.5 after:w-full after:bg-primary',
        isOverlay && 'z-50 cursor-grabbing border border-primary',
      )}
      onBlur={isOverlay ? undefined : () => setIsHover(false)}
      onClick={isOverlay ? undefined : handleClick}
      onFocus={isOverlay ? undefined : () => setIsHover(true)}
      onMouseEnter={isOverlay ? undefined : () => setIsHover(true)}
      onMouseLeave={isOverlay ? undefined : () => setIsHover(false)}
      style={{
        ...style,
        marginLeft: isOverlay ? 0 : finalIndent,
        width: isOverlay ? '100%' : `calc(100% - ${finalIndent}px)`,
      }}
    >
      <Checkbox
        classNames={{
          icon: cn('flex items-center'),
          base: cn('outline-1 outline-red-400'),
          wrapper: cn('mr-0'),
        }}
        id={task.id}
        isSelected={task.completed}
        onValueChange={
          (isSelected: boolean) => {
            updateTaskMutation.mutate({
              data: { completed: isSelected },
              taskId: task.id,
            });
          }
        }
        radius="full"
      />
      <div className="truncate">
        <div>
          <CustomMarkdown isTruncated>{task.name}</CustomMarkdown>
          {task.body && (
            <div className="task-body-truncated flex items-center gap-1">
              <CustomMarkdown isTruncated>{task.body}</CustomMarkdown>
            </div>
          )}
          {isOverlay && childrenCount > 0 && <Code className="text-xs font-bold" color="primary">{childrenCount}</Code> }
        </div>
        {updateTaskMutation.error && (
          <MutationError
            error={updateTaskMutation.error}
            mutationName="updateTask"
          />
        )}
      </div>
      {isHover && (
        <div className="ml-auto flex gap-1.5">
          {updateTaskMutation.isPending && (
            <CircularProgress
              aria-label="Loading"
              classNames={{
                base: cn('ml-auto self-center'),
                svg: cn('h-5 w-5'),
              }}
            />
          )}
          <UpdateTaskButton isIconOnly setIsFormOpen={setIsFormOpen} />
          <DeleteTaskButton isIconOnly task={task} />
        </div>
      )}
    </a>
  );
});

export default Task;
