import { Button, Card, CardBody, CardFooter, Input, Textarea } from '@heroui/react';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import useCreateTaskMutation from '../mutations/useCreateTaskMutation';
import useUpdateTaskMutation from '../mutations/useUpdateTaskMutation';
import { createTaskZ, updateTaskZ } from '../types/dataSchemas';
import cn from '../utils/cn';
import MutationError from './MutationError';

import type { CreateTask, Task, TaskScalar } from '../types/dataSchemas';
import type { SubmitHandler } from 'react-hook-form';

interface CommonProps {
  inModal?: boolean;
  setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type CreateProps = CommonProps & {
  mode: 'create';
  task: undefined;
  parentTaskId?: string;
};

type UpdateProps = CommonProps & {
  mode: 'update';
  task: Task | TaskScalar;
  parentTaskId: undefined;
};

type Props = CreateProps | UpdateProps;

export default function TaskForm({ inModal = false, setIsFormOpen, mode, task, parentTaskId }: Props) {
  const {
    handleSubmit,
    control,
    formState,
    reset: resetForm,
  } = useForm<{ name: string; body: string }>({
    defaultValues: {
      name: mode === 'create' ? '' : task.name,
      body: mode === 'create' ? '' : task.body || '',
    },
    resolver: zodResolver(mode === 'create' ? createTaskZ : updateTaskZ),
  });

  const params = useParams<'projectId' | 'taskId'>();
  const createTaskMutation = useCreateTaskMutation(params.projectId || '');
  const updateTaskMutation = useUpdateTaskMutation();

  const onSubmit: SubmitHandler<CreateTask> = (data) => {
    if (mode === 'create') {
      createTaskMutation.mutate({
        name: data.name,
        body: data.body,
        parentTaskId,
      });
    }
    else {
      updateTaskMutation.mutate({
        data: {
          name: data.name,
          body: data.body,
        },
        taskId: task.id,
      });
    }
  };

  useEffect(() => {
    if (createTaskMutation.isSuccess)
      setIsFormOpen(false);
  }, [createTaskMutation.isSuccess]);

  useEffect(() => {
    if (updateTaskMutation.isSuccess)
      setIsFormOpen(false);
  }, [updateTaskMutation.isSuccess]);

  return (
    <Card
      classNames={{
        base: cn('grow outline outline-1 outline-default-500'),
        body: cn('gap-2'),
        footer: cn('flex-col items-end gap-2'),
      }}
      shadow="none"
    >
      <form
        className="rounded-lg font-mono outline outline-1 outline-default"
        onSubmit={handleSubmit(onSubmit)}
      >
        <CardBody>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                {...field}
                autoFocus
                classNames={{
                  input: 'text-large font-semibold',
                }}
                errorMessage={formState.errors.name?.message}
                isInvalid={Boolean(formState.errors.name)}
                label={inModal ? undefined : 'Task name'}
                radius="sm"
                type="text"
              />
            )}
          />
          <Controller
            control={control}
            name="body"
            render={({ field }) => (
              <Textarea
                {...field}
                classNames={{
                  input: 'text-[0.8rem]',
                }}
                errorMessage={formState.errors.body?.message}
                isInvalid={Boolean(formState.errors.body)}
                label={inModal ? undefined : 'Body'}
                maxRows={15}
                radius="sm"
              />
            )}
          />
        </CardBody>
        <CardFooter>
          <div className="flex justify-end gap-2">
            <Button
              onPress={() => {
                mode === 'create' ? createTaskMutation.reset() : updateTaskMutation.reset();
                setIsFormOpen(false);
                resetForm();
              }}
              radius="sm"
              size="sm"
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              isDisabled={!formState.isDirty}
              isLoading={mode === 'create' ? createTaskMutation.isPending : updateTaskMutation.isPending}
              radius="sm"
              size="sm"
              type="submit"
            >
              {mode === 'create' ? 'Create Task' : 'Update Task'}
            </Button>
          </div>
          {createTaskMutation.error
          && (
            <MutationError
              error={createTaskMutation.error}
              mutationName="createTask"
            />
          )}
          {updateTaskMutation.error
          && (
            <MutationError
              error={updateTaskMutation.error}
              mutationName="updateTask"
            />
          )}
        </CardFooter>
        {import.meta.env.PROD || <DevTool control={control} />}
      </form>
    </Card>
  );
}
