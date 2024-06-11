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
import MutationError from './MutationError';

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
            className={cn('data-[focus-visible]:-outline-offset-2', isHover ? 'opacity-100' : 'opacity-0')}
            isIconOnly
            variant="light"
          >
            <Icon className="text-lg" icon="material-symbols:more-horiz" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Project Actions"
        >
          <DropdownItem
            key="rename"
            onPress={onRenameProjectOpen}
            startContent={<Icon icon="material-symbols:edit" />}
          >
            Rename
          </DropdownItem>
          <DropdownItem
            className="text-danger"
            color="danger"
            key="delete"
            onPress={onDeleteProjectOpen}
            startContent={<Icon icon="material-symbols:delete" />}
          >
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Modal
        classNames={{
          footer: 'mt-6 flex-col',
        }}
        isOpen={isRenameProjectOpen}
        onOpenChange={onRenameProjectOpenChange}
      >
        <ModalContent>
          {onClose => (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1">Rename</ModalHeader>
              <ModalBody>
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Input
                      {...field}
                      autoFocus
                      errorMessage={formState.errors.name?.message}
                      isInvalid={Boolean(formState.errors.name)}
                      label="Name"
                      type="text"
                    />
                  )}
                />
              </ModalBody>
              <ModalFooter>
                <div className="flex justify-end gap-2">

                  <Button
                    color="danger"
                    onPress={() => {
                      renameProjectMutation.reset();
                      resetForm();
                      onClose();
                    }}
                    variant="light"
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    isDisabled={!formState.isDirty}
                    isLoading={renameProjectMutation.isPending}
                    type="submit"

                  >
                    Rename
                  </Button>
                </div>
                {renameProjectMutation.isError && (
                  <MutationError
                    error={renameProjectMutation.error}
                    mutationName="renameProject"
                  />
                )}
              </ModalFooter>
              <DevTool control={control} />
            </form>
          )}
        </ModalContent>
      </Modal>
      <Modal
        classNames={{
          footer: 'mt-6 flex-col',
        }}
        isOpen={isDeleteProjectOpen}
        onOpenChange={onDeleteProjectOpenChange}
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
                    onPress={onClose}
                    variant="light"
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
                {deleteProjectMutation.isError && (
                  <MutationError
                    error={deleteProjectMutation.error}
                    mutationName="deleteProject"
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
