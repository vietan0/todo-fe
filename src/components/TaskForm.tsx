import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, CardBody, CardFooter, Input } from '@nextui-org/react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import useCreateTaskMutation from '../mutations/useCreateTaskMutation';
import useUpdateTaskMutation from '../mutations/useUpdateTaskMutation';
import { createTaskZ, updateTaskZ } from '../types/dataSchemas';
import MutationError from './MutationError';

import type { CreateTask, Task } from '../types/dataSchemas';
import type { SubmitHandler } from 'react-hook-form';

interface CommonProps {
  setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type CreateProps = CommonProps & {
  mode: 'create';
  task: undefined;
  parentTaskId?: string;
};

type UpdateProps = CommonProps & {
  mode: 'update';
  task: Task;
  parentTaskId: undefined;
};

type Props = CreateProps | UpdateProps;

export default function TaskForm({ setIsFormOpen, mode, task, parentTaskId }: Props) {
  const {
    handleSubmit,
    control,
    formState,
    reset: resetForm,
  } = useForm<{ name: string }>({
    defaultValues: { name: mode === 'create' ? '' : task.name },
    resolver: zodResolver(mode === 'create' ? createTaskZ : updateTaskZ),
  });

  const params = useParams<'projectId' | 'taskId'>();
  const createTaskMutation = useCreateTaskMutation(params.projectId || '');
  const updateTaskMutation = useUpdateTaskMutation(task?.id || '');

  const onSubmit: SubmitHandler<CreateTask> = (data) => {
    if (mode === 'create') {
      createTaskMutation.mutate({
        name: data.name,
        parentTaskId,
      });
    }
    else {
      updateTaskMutation.mutate({
        name: data.name,
      // TODO: projectId, parentTaskId will be provided somewhere else in the form (not an <input> field)
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
      shadow="none"
      classNames={{
        base: 'outline outline-1 outline-default-500',
        body: 'gap-0',
        footer: 'flex-col items-end gap-2',
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
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              radius="sm"
              onPress={() => {
                mode === 'create' ? createTaskMutation.reset() : updateTaskMutation.reset();
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
              isDisabled={!formState.isDirty}
              isLoading={mode === 'create' ? createTaskMutation.isPending : updateTaskMutation.isPending}
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
        <DevTool control={control} />
      </form>
    </Card>
  );
}

;
