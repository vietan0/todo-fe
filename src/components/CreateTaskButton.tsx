import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Card, CardBody, CardFooter, Input } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import useCreateTaskMutation from '../queries/useCreateTaskMutation';
import { createTaskZ } from '../types/dataSchemas';

import type { SubmitHandler } from 'react-hook-form';

interface CreateTask {
  name: string;
}

export default function CreateTaskButton({ parentTaskId }: { parentTaskId?: string }) {
  const {
    handleSubmit,
    control,
    formState,
    reset: resetForm,
  } = useForm<CreateTask>({
    defaultValues: { name: '' },
    resolver: zodResolver(createTaskZ),
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const params = useParams<'projectId' | 'taskId'>();
  const createTaskMutation = useCreateTaskMutation(params.projectId || '');

  const onSubmit: SubmitHandler<CreateTask> = (data) => {
    createTaskMutation.mutate({
      name: data.name,
      parentTaskId,
    });
  };

  useEffect(() => {
    if (createTaskMutation.isSuccess)
      setIsFormOpen(false);
  }, [createTaskMutation.isSuccess]);

  useEffect(() => {
    if (!isFormOpen) {
      resetForm();
      createTaskMutation.reset();
    }
  }, [isFormOpen]);

  if (isFormOpen) {
    return (
      <Card
        shadow="none"
        classNames={{
          base: 'outline outline-1 outline-default-500',
          body: 'gap-0',
          footer: 'justify-end gap-2',
        }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-lg outline outline-1 outline-default"
        >
          <CardBody>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  label="Task name"
                  autoFocus
                  variant="underlined"
                  isInvalid={Boolean(formState.errors.name)}
                  errorMessage={formState.errors.name?.message}
                />
              )}
            />
          </CardBody>
          <CardFooter>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                radius="sm"
                onPress={() => {
                  createTaskMutation.reset();
                  setIsFormOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
                radius="sm"
                isLoading={createTaskMutation.isPending}

              >
                Create Task
              </Button>
            </div>
            {createTaskMutation.isError
              ? (
                <p onClick={() => createTaskMutation.reset()} className="font-mono text-sm text-danger">
                  An error occurred:
                  {createTaskMutation.error.message}
                </p>
                )
              : null}
          </CardFooter>
          <DevTool control={control} />
        </form>
      </Card>
    );
  }

  return (
    <Button
      radius="sm"
      variant="ghost"
      color="primary"
      startContent={<Icon icon="material-symbols:add" className="shrink-0 text-lg" />}
      className="self-start"
      onPress={() => setIsFormOpen(true)}
    >
      Create Task
    </Button>
  );
}
