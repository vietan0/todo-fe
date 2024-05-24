import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { Controller, useForm } from 'react-hook-form';

import useDeleteProjectMutation from '../queries/useDeleteProjectMutation';
import useRenameProjectMutation from '../queries/useRenameProjectMutation';
import { type Project, type RenameProjectPayload, renameProjectPayloadSchema } from '../types/schemas';

import type { SubmitHandler } from 'react-hook-form';

export default function ProjectActionBtn({ project, isHover }: { project: Project; isHover: boolean }) {
  const {
    isOpen: isRenameProjectOpen,
    onOpen: onRenameProjectOpen,
    onOpenChange: onRenameProjectOpenChange,
  } = useDisclosure();

  const {
    isOpen: isDeleteProjectOpen,
    onOpen: onDeleteProjectOpen,
    onOpenChange: onDeleteProjectOpenChange,
  } = useDisclosure();

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(renameProjectPayloadSchema),
    defaultValues: {
      name: project.name,
    },
  });

  const renameProjectMutation = useRenameProjectMutation(project.id);

  const onSubmit: SubmitHandler<RenameProjectPayload> = (data) => {
    renameProjectMutation.mutate(data);
    reset();
  };

  const deleteProjectMutation = useDeleteProjectMutation(project.id);

  return (
    <>
      <Dropdown
        classNames={{
          content: 'min-w-36', // default: 200px
        }}
      >
        <DropdownTrigger>
          <Button
            isIconOnly
            variant="light"
            className={isHover ? 'opacity-100' : 'opacity-0'}
          >
            <Icon icon="material-symbols:more-horiz" className="text-lg" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Project Actions"
        >
          <DropdownItem
            onPress={onRenameProjectOpen}
            startContent={<Icon icon="material-symbols:edit" />}
            key="rename"
          >
            Rename
          </DropdownItem>
          <DropdownItem
            onPress={onDeleteProjectOpen}
            startContent={<Icon icon="material-symbols:delete" />}
            key="delete"
            className="text-danger"
            color="danger"
          >
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Modal isOpen={isRenameProjectOpen} onOpenChange={onRenameProjectOpenChange}>
        <ModalContent>
          {onClose => (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1">Rename</ModalHeader>
              <ModalBody>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      label="Name"
                    />
                  )}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  onPress={onClose}
                >
                  Rename
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isDeleteProjectOpen} onOpenChange={onDeleteProjectOpenChange}>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">Are you sure you want to delete this project?</ModalHeader>
              <ModalBody>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    deleteProjectMutation.mutate();
                    onClose();
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
