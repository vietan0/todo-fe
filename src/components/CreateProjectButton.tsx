import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { Controller, useForm } from 'react-hook-form';

import useCreateProjectMutation from '../queries/useCreateProjectMutation';
import { createProjectPayloadSchema } from '../types/schemas';

import type { CreateProjectPayload } from '../types/schemas';
import type { SubmitHandler } from 'react-hook-form';

export default function CreateProjectButton() {
  const {
    isOpen,
    onOpen,
    onOpenChange,
  } = useDisclosure();

  const {
    handleSubmit,
    control,
    formState,
    reset,
  } = useForm<CreateProjectPayload>({
    resolver: zodResolver(createProjectPayloadSchema),
  });

  const createProjectMutation = useCreateProjectMutation();

  const onSubmit: SubmitHandler<CreateProjectPayload> = (data) => {
    createProjectMutation.mutate(data);
    reset();
  };

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
          footer: 'mt-6',
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
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  onPress={onClose}
                >
                  Create
                </Button>
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
