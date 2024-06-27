import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Checkbox, CircularProgress, Code, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, useDisclosure } from '@nextui-org/react';
import { forwardRef, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useDeleteTaskMutation from '../mutations/useDeleteTaskMutation';
import useUpdateTaskMutation from '../mutations/useUpdateTaskMutation';
import cn from '../utils/cn';
import { indent } from '../utils/sortTasks';
import MutationError from './MutationError';
import TaskForm from './TaskForm';

import type { Task as TaskT } from '../types/dataSchemas';
import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import type { HTMLAttributes } from 'react';

function noop() {}

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
        task.completed ? 'opacity-disabled' : 'hover:bg-default-100',
        'bg-default-50 border border-default h-auto min-h-[55px] items-start justify-start p-3 text-start text-sm',
        'tap-highlight-transparent no-underline active:opacity-disabled transition-opacity z-0 group relative inline-flex box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 min-w-20 text-small gap-2 rounded-small [&>svg]:max-w-[theme(spacing.8)] !transition-none text-foreground data-[hover=true]:opacity-hover',
        isDragging && 'cursor-grabbing',
        isDragging && `before:ml-0.5 before:absolute before:-left-2.5 before:-top-3 before:w-3 before:h-3 before:border-3 before:border-primary before:rounded-full`,
        isDragging && `after:ml-0.5 after:absolute after:left-0 after:-top-2 after:w-full after:h-0.5 after:bg-primary`,
        isOverlay && 'border border-primary',
      )}
      onBlur={isOverlay ? noop : () => setIsHover(false)}
      onClick={() => {
        nav(`task/${task.id}`);
        onTaskModalOpen();
      }}
      onFocus={isOverlay ? noop : () => setIsHover(true)}
      onMouseEnter={isOverlay ? noop : () => setIsHover(true)}
      onMouseLeave={isOverlay ? noop : () => setIsHover(false)}
      style={{ ...style, marginLeft: finalIndent }}
    >
      <Checkbox
        classNames={{
          base: 'outline-1 outline-red-400',
          wrapper: 'mr-0',
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
          {isDragging && childrenCount > 0 && <Code className="text-xs">{childrenCount}</Code> }
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
                base: 'self-center ml-auto',
                svg: 'w-5 h-5',
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
              footer: 'mt-6 flex-col',
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
