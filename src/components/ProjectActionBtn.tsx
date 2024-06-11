import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import useDeleteProjectMutation from '../mutations/useDeleteProjectMutation';
import useRenameProjectMutation from '../mutations/useRenameProjectMutation';
import { type ProjectScalar, type RenameProject, renameProjectZ } from '../types/dataSchemas';
import cn from '../utils/cn';

import type { SubmitHandler } from 'react-hook-form';

export default function ProjectActionBtn({ project, isHover }: { project: ProjectScalar; isHover: boolean }) {
  const {
    isOpen: isRenameProjectOpen,
    onOpen: onRenameProjectOpen,
    onOpenChange: onRenameProjectOpenChange,
    onClose: onRenameProjectClose,
  } = useDisclosure();

  const {
    control,
    handleSubmit,
    formState,
    reset: resetForm,
  } = useForm({
    defaultValues: { name: project.name },
    resolver: zodResolver(renameProjectZ),
  });

  const renameProjectMutation = useRenameProjectMutation(project.id);

  const onSubmit: SubmitHandler<RenameProject> = (data) => {
    renameProjectMutation.mutate(data);
  };

  useEffect(() => {
    if (renameProjectMutation.isSuccess) {
      onRenameProjectClose();
      resetForm();
    }
  }, [renameProjectMutation.isSuccess]);

  useEffect(() => {
    if (!isRenameProjectOpen) {
      resetForm();
      renameProjectMutation.reset();
    }
  }, [isRenameProjectOpen]);

  const {
    isOpen: isDeleteProjectOpen,
    onOpen: onDeleteProjectOpen,
    onOpenChange: onDeleteProjectOpenChange,
    onClose: onDeleteProjectClose,
  } = useDisclosure();

  const deleteProjectMutation = useDeleteProjectMutation(project.id);

  useEffect(() => {
    if (deleteProjectMutation.isSuccess)
      onDeleteProjectClose();
  }, [deleteProjectMutation.isSuccess]);

  useEffect(() => {
    if (!isDeleteProjectOpen)
      deleteProjectMutation.reset();
  }, [isDeleteProjectOpen]);

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
            className={cn('data-[focus-visible]:-outline-offset-2', isHover ? 'opacity-100' : 'opacity-0')}
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
      <Modal
        isOpen={isRenameProjectOpen}
        onOpenChange={onRenameProjectOpenChange}
        classNames={{
          footer: 'mt-6 flex-col',
        }}
      >
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
                      autoFocus
                      isInvalid={Boolean(formState.errors.name)}
                      errorMessage={formState.errors.name?.message}
                    />
                  )}
                />
              </ModalBody>
              <ModalFooter>
                <div className="flex justify-end gap-2">

                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => {
                      renameProjectMutation.reset();
                      resetForm();
                      onClose();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    isDisabled={!formState.isDirty}
                    isLoading={renameProjectMutation.isPending}

                  >
                    Rename
                  </Button>
                </div>
                {renameProjectMutation.isError
                  ? (
                    <p onClick={() => renameProjectMutation.reset()} className="font-mono text-sm text-danger">
                      An error occurred while updating the project:
                      {renameProjectMutation.error.message}
                    </p>
                    )
                  : null}
              </ModalFooter>
              <DevTool control={control} />

            </form>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isDeleteProjectOpen}
        onOpenChange={onDeleteProjectOpenChange}
        classNames={{
          footer: 'mt-6 flex-col',
        }}
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are you sure you want to delete project "
                {project.name}
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
                    isLoading={deleteProjectMutation.isPending}
                    onPress={() => {
                      deleteProjectMutation.mutate();
                    }}
                  >
                    Delete
                  </Button>
                </div>
                {deleteProjectMutation.isError
                  ? (
                    <p onClick={() => deleteProjectMutation.reset()} className="font-mono text-sm text-danger">
                      An error occurred while deleting the project:
                      {deleteProjectMutation.error.message}
                    </p>
                    )
                  : null}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
