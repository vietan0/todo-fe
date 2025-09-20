import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import type { HTMLAttributes } from 'react';
import type { TaskScalar, Task as TaskT } from '../types/dataSchemas';
import { Checkbox, CircularProgress, Code } from '@heroui/react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import useUpdateTaskMutation from '../mutations/useUpdateTaskMutation';
import { indent } from '../utils/calcRank';
import cn from '../utils/cn';
import CustomMarkdown from './CustomMarkdown';
import DeleteTaskButton from './DeleteTaskButton';
import MutationError from './MutationError';
import TaskForm from './TaskForm';
import UpdateTaskButton from './UpdateTaskButton';

type Props = Omit<HTMLAttributes<HTMLDivElement>, 'id'> & {
  deltaX: number;
  task: TaskT | TaskScalar;
  inModal: boolean;
  isTaskModalOpen: boolean;
  onTaskModalOpen: () => void;
  isDragging: boolean;
  isOverlay: boolean;
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
  ref: React.Ref<HTMLDivElement>;
  style: {
    transform: string | undefined;
    transition: string | undefined;
  };
};

export default function Task({
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
}: Props) {
  const updateTaskMutation = useUpdateTaskMutation();
  const nav = useNavigate();
  const [isHover, setIsHover] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState<false | 'name' | 'body'>(false);
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

  useEffect(() => {
    if (!isFormOpen)
      setIsHover(false);
  }, [isFormOpen]);

  if (isFormOpen) {
    return (
      <TaskForm
        autoFocusField="name"
        finalIndent={finalIndent}
        mode="update"
        parentTaskId={undefined}
        setIsFormOpen={setIsFormOpen}
        task={task}
      />
    );
  }

  return (
    <div
      {...attributes}
      {...listeners}
      {...props}
      className={cn(
        `
          group relative z-0 box-border inline-flex min-w-20 appearance-none gap-2 rounded-lg font-normal
          whitespace-nowrap text-foreground no-underline subpixel-antialiased select-none tap-highlight-transparent
          active:opacity-disabled
          [&>svg]:max-w-8
        `, // copied HeroUI Button's styles
        `
          h-auto shrink-0 cursor-pointer items-start justify-start border border-default bg-default-50 p-3 text-start
          text-sm
        `,
        task.completed
          ? 'opacity-disabled'
          : `
            hover:opacity-hover
            focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus
          `,
        isDragging && `
          before:absolute before:-top-3 before:-left-2.5 before:ml-0.5 before:size-3 before:rounded-full before:border-3
          before:border-primary
          after:absolute after:-top-2 after:left-0 after:ml-0.5 after:h-0.5 after:w-full after:bg-primary
        `,
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
          <CustomMarkdown field="name" isTruncated>{task.name}</CustomMarkdown>
          {task.body && (
            <div className={`
              task-body-truncated items-center gap-1 text-xs font-normal text-foreground-500
              *:inline-block
            `}
            >
              <CustomMarkdown field="body" isTruncated>{task.body}</CustomMarkdown>
            </div>
          )}
          {isOverlay && childrenCount > 0 && <Code className="text-xs font-bold" color="primary">{childrenCount}</Code>}
        </div>
        {updateTaskMutation.error && (
          <MutationError
            error={updateTaskMutation.error}
            mutationName="updateTask"
          />
        )}
      </div>
      <div className={cn(
        `
          absolute top-1/2 right-1.5 ml-auto flex -translate-y-1/2 gap-1.5 bg-gradient-to-l from-default-50 from-80%
          to-transparent pl-3
        `,
        isHover ? 'opacity-100' : 'opacity-0',
      )}
      >
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
    </div>
  );
}
