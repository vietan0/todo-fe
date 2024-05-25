import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import useCreateProjectMutation from '../queries/useCreateProjectMutation';
import { createProjectZ } from '../types/dataSchemas';

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
    watch,
  } = useForm<CreateProject>({
    defaultValues: { name: '' },
    resolver: zodResolver(createProjectZ),
  });

  const createProjectMutation = useCreateProjectMutation();

  const onSubmit: SubmitHandler<CreateProject> = (data) => {
    createProjectMutation.mutate(data);
  };

  console.log('name:', watch('name')); // watch input value by passing the name of it

  useEffect(() => {
    if (createProjectMutation.isSuccess) {
      onClose();
      resetForm();
    }
  }, [createProjectMutation.isSuccess]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
      createProjectMutation.reset();
    }
  }, [isOpen]);

  return (
    <>
      <Button
        isIconOnly
        size="sm"
        variant="light"
        startContent={<Icon icon="material-symbols:add" className="text-lg text-default-500" />}
        aria-label="Add Project"
        onPress={onOpen}
      />
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          footer: 'mt-6 flex-col',
        }}
      >
        <ModalContent>
          {onClose => (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1">Create Project</ModalHeader>
              <ModalBody>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      label="Project Name"
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
                      createProjectMutation.reset();
                      resetForm();
                      onClose();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    isLoading={createProjectMutation.isPending}
                  >
                    Create
                  </Button>
                </div>
                {createProjectMutation.isError
                  ? (
                    <p onClick={() => createProjectMutation.reset()} className="font-mono text-sm text-danger">
                      An error occurred:
                      {createProjectMutation.error.message}
                    </p>
                    )
                  : null}
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
