import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, CardBody, CardFooter, Input } from '@nextui-org/react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import useCreateTaskMutation from '../queries/useCreateTaskMutation';
import { createTaskZ } from '../types/dataSchemas';

import type { CreateTask } from '../types/dataSchemas';
import type { SubmitHandler } from 'react-hook-form';

export default function CreateTaskForm({ parentTaskId, setIsFormOpen }: {
  parentTaskId?: string;
  setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    handleSubmit,
    control,
    formState,
    reset: resetForm,
  } = useForm<CreateTask>({
    defaultValues: { name: '' },
    resolver: zodResolver(createTaskZ),
  });

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

;
