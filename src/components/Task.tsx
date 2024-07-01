import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Checkbox, CircularProgress, Code, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, useDisclosure } from '@nextui-org/react';
import { forwardRef, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useDeleteTaskMutation from '../mutations/useDeleteTaskMutation';
import useUpdateTaskMutation from '../mutations/useUpdateTaskMutation';
import { indent } from '../utils/calcTaskRankAfterDragged';
import cn from '../utils/cn';
import noop from '../utils/noop';
import MutationError from './MutationError';
import TaskForm from './TaskForm';

import type { Task as TaskT } from '../types/dataSchemas';
import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import type { HTMLAttributes } from 'react';

type Props = Omit<HTMLAttributes<HTMLAnchorElement>, 'id'> & {
  deltaX: number;
  task: TaskT;
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
  onTaskModalOpen,
  isDragging,
  isOverlay,
  attributes,
  listeners,
  style,
  ...props
}, ref) => {
  const updateTaskMutation = useUpdateTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation(task.id);
  const nav = useNavigate();
  const [isHover, setIsHover] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const childrenCount = task.subTasks.length;

  const finalIndent = useMemo(() => {
    // based on task level, deltaX & isDragging
    if (!isDragging)
      return task.parentTaskId ? indent : 0;

    // when dragging
    if (task.parentTaskId === null)
      return deltaX > indent ? indent : 0;

    else
      return deltaX < -indent ? 0 : indent;
  }, [task.parentTaskId, deltaX, isDragging]);

  const {
    isOpen: isDeleteTaskOpen,
    onOpen: onDeleteTaskOpen,
    onOpenChange: onDeleteTaskOpenChange,
  } = useDisclosure();

  function handleClick() {
    nav(`task/${task.id}`);
    onTaskModalOpen();
  }

  if (isFormOpen) {
    return (
      <TaskForm
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
        task.completed ? 'opacity-disabled' : 'hover:bg-default-100 hover:opacity-hover focus:bg-default-100 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        'h-auto min-h-[55px] items-start justify-start border border-default bg-default-50 p-3 text-start text-sm',
        'group relative z-0 box-border inline-flex min-w-20 select-none appearance-none gap-2 whitespace-nowrap rounded-small font-normal text-foreground no-underline subpixel-antialiased outline-none transition-opacity tap-highlight-transparent active:opacity-disabled [&>svg]:max-w-[theme(spacing.8)]',
        isDragging && 'z-50 cursor-grabbing',
        isDragging && `before:absolute before:-left-2.5 before:-top-3 before:ml-0.5 before:size-3 before:rounded-full before:border-3 before:border-primary`,
        isDragging && `after:absolute after:-top-2 after:left-0 after:ml-0.5 after:h-0.5 after:w-full after:bg-primary`,
        isOverlay && 'border border-primary',
      )}
      onBlur={isOverlay ? noop : () => setIsHover(false)}
      onClick={isOverlay ? noop : handleClick}
      onFocus={isOverlay ? noop : () => setIsHover(true)}
      onMouseEnter={isOverlay ? noop : () => setIsHover(true)}
      onMouseLeave={isOverlay ? noop : () => setIsHover(false)}
      style={{ ...style, marginLeft: finalIndent }}
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
      <div>
        <div>
          <p>{task.name}</p>
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
                // eslint-disable-next-line tailwindcss/enforces-shorthand
                svg: cn('h-5 w-5'),
              }}
            />
          )}
          <Tooltip
            content="Edit Task"
            delay={500}
          >
            <Button
              aria-label="Edit Task"
            // eslint-disable-next-line tailwindcss/enforces-shorthand
              className="h-7 w-7 min-w-0 data-[hover=true]:bg-default/60"
              disableAnimation
              isIconOnly
              onPress={() => setIsFormOpen(true)}
              radius="sm"
              size="sm"
              variant="light"
            >
              <Icon className="text-xl text-default-700" icon="material-symbols:edit" />
            </Button>
          </Tooltip>
          <Tooltip
            content="Delete Task"
            delay={500}
          >
            <Button
              aria-label="Delete Task"
            // eslint-disable-next-line tailwindcss/enforces-shorthand
              className="h-7 w-7 min-w-0 data-[hover=true]:bg-default/60"
              disableAnimation
              isIconOnly
              onPress={onDeleteTaskOpen}
              radius="sm"
              size="sm"
              variant="light"
            >
              <Icon className="text-xl text-default-700" icon="material-symbols:delete" />
            </Button>
          </Tooltip>
          <Modal
            classNames={{
              footer: cn('mt-6 flex-col'),
            }}
            isOpen={isDeleteTaskOpen}
            onOpenChange={onDeleteTaskOpenChange}
          >
            <ModalContent>
              {onClose => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Are you sure you want to delete task "
                    {task.name}
                    "? This can't be reversed.
                  </ModalHeader>
                  <ModalBody>
                  </ModalBody>
                  <ModalFooter>
                    <div className="flex justify-end gap-2">
                      <Button
                        color="default"
                        onPress={onClose}
                        variant="light"
                      >
                        Cancel
                      </Button>
                      <Button
                        color="danger"
                        isLoading={deleteTaskMutation.isPending}
                        onPress={() => {
                          deleteTaskMutation.mutate();
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                    {deleteTaskMutation.error
                    && (
                      <MutationError
                        error={deleteTaskMutation.error}
                        mutationName="deleteTask"
                      />
                    )}
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      )}
    </a>
  );
});

export default Task;
