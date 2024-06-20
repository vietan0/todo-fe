import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Checkbox, CircularProgress, Code, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, useDisclosure } from '@nextui-org/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useDeleteTaskMutation from '../mutations/useDeleteTaskMutation';
import useUpdateTaskMutation from '../mutations/useUpdateTaskMutation';
import cn from '../utils/cn';
import MutationError from './MutationError';
import TaskForm from './TaskForm';

import type { Task as TaskT } from '../types/dataSchemas';

export default function Task({ task, onTaskModalOpen }: { task: TaskT; onTaskModalOpen: () => void }) {
  const updateTaskMutation = useUpdateTaskMutation(task.id);
  const deleteTaskMutation = useDeleteTaskMutation(task.id);
  const nav = useNavigate();
  const [isHover, setIsHover] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
    <Button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      // eslint-disable-next-line perfectionist/sort-jsx-props
      as={Link}
      className={cn(
        task.parentTaskId && 'ml-8',
        task.completed ? 'opacity-disabled' : 'hover:bg-default-100',
        'h-auto min-h-[55px] items-start justify-start p-3 text-start',
      )}
      disableAnimation
      endContent={isHover && (
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
      onBlur={() => setIsHover(false)}
      onFocus={() => setIsHover(true)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onPress={() => {
        nav(`task/${task.id}`);
        onTaskModalOpen();
      }}
      radius="sm"
      variant="bordered"
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
            updateTaskMutation.mutate({ completed: isSelected });
          }
        }
        radius="full"
      />
      <div>
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
        {updateTaskMutation.error && (
          <MutationError
            error={updateTaskMutation.error}
            mutationName="updateTask"
          />
        )}
      </div>
    </Button>
  );
}
