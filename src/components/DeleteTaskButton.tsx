import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, useDisclosure } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

import useDeleteTaskMutation from '../mutations/useDeleteTaskMutation';
import cn from '../utils/cn';
import MutationError from './MutationError';

import type { Task, TaskScalar } from '../types/dataSchemas';

export default function DeleteTaskButton({
  isIconOnly = false,
  task,
}: {
  isIconOnly?: boolean;
  task: Task | TaskScalar;
},
) {
  const deleteTaskMutation = useDeleteTaskMutation(task.id);

  const {
    isOpen: isDeleteTaskOpen,
    onOpen: onDeleteTaskOpen,
    onOpenChange: onDeleteTaskOpenChange,
  } = useDisclosure();

  return (
    <>
      <Tooltip
        closeDelay={0}
        content="Delete Task"
        delay={500}
      >
        <Button
          aria-label="Delete Task"
          // eslint-disable-next-line tailwindcss/enforces-shorthand
          className={cn(
            'min-w-0 data-[hover=true]:bg-default/60',
            isIconOnly ? 'h-7 w-7' : 'justify-start',
          )}
          disableAnimation
          isIconOnly={isIconOnly}
          onPress={onDeleteTaskOpen}
          radius="sm"
          size="sm"
          variant={isIconOnly ? 'light' : 'ghost'}
        >
          <Icon className="text-xl text-default-700" icon="material-symbols:delete" />
          {isIconOnly || 'Delete Task'}
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
    </>
  );
}
