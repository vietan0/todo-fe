import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Checkbox, CircularProgress, Code, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
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
    isOpen: isDeleteTaskOpen,
    onOpen: onDeleteTaskOpen,
    onOpenChange: onDeleteTaskOpenChange,
  } = useDisclosure();

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
      as={Link}
      onPress={() => {
        nav(`task/${task.id}`);
        onTaskModalOpen();
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
          {updateTaskMutation.isPending && (
            <CircularProgress
              aria-label="Loading"
              classNames={{
                base: 'self-center ml-auto',
                svg: 'w-5 h-5',
              }}
            />
          )}
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
            onPress={onDeleteTaskOpen}
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
          <Modal
            isOpen={isDeleteTaskOpen}
            onOpenChange={onDeleteTaskOpenChange}
            classNames={{
              footer: 'mt-6 flex-col',
            }}
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
                        variant="light"
                        onPress={onClose}
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
