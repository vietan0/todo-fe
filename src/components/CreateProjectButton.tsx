import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import useCreateProjectMutation from '../mutations/useCreateProjectMutation';
import { createProjectZ } from '../types/dataSchemas';
import MutationError from './MutationError';

import type { CreateProject } from '../types/dataSchemas';
import type { SubmitHandler } from 'react-hook-form';

export default function CreateProjectButton() {
  const {
    isOpen,
    onOpen,
    onOpenChange,
    onClose,
  } = useDisclosure();

  const {
    handleSubmit,
    control,
    formState,
    reset: resetForm,
  } = useForm<CreateProject>({
    defaultValues: { name: '' },
    resolver: zodResolver(createProjectZ),
  });

  const { mutate, reset, isSuccess, isPending, error } = useCreateProjectMutation();

  const onSubmit: SubmitHandler<CreateProject> = (data) => {
    mutate(data);
  };

  useEffect(() => {
    if (isSuccess) {
      onClose();
      resetForm();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
      reset();
    }
  }, [isOpen]);

  return (
    <>
      <Button
        aria-label="Add Project"
        isIconOnly
        onPress={onOpen}
        size="sm"
        startContent={<Icon className="text-lg text-default-500" icon="material-symbols:add" />}
        variant="light"
      />
      <Modal
        classNames={{
          footer: 'mt-6 flex-col',
        }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {onClose => (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1">Create Project</ModalHeader>
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
                      reset();
                      resetForm();
                      onClose();
                    }}
                    variant="light"
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    isLoading={isPending}
                    type="submit"
                  >
                    Create
                  </Button>
                </div>
                {error && (
                  <MutationError
                    error={error}
                    mutationName="createProject"
                  />
                )}
              </ModalFooter>
              <DevTool control={control} />
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  )
  ;
}
