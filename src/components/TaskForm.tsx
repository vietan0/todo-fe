import type { SubmitHandler } from 'react-hook-form';
import type { CreateTask, Task, TaskScalar } from '../types/dataSchemas';
import { Button, Card, CardBody, CardFooter, Textarea } from '@heroui/react';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import useCreateTaskMutation from '../mutations/useCreateTaskMutation';
import useUpdateTaskMutation from '../mutations/useUpdateTaskMutation';
import { createTaskZ, updateTaskZ } from '../types/dataSchemas';
import cn from '../utils/cn';
import MutationError from './MutationError';

interface CommonProps {
  finalIndent: 0 | 40;
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

export default function TaskForm({ inModal = false, finalIndent, setIsFormOpen, mode, task, parentTaskId }: Props) {
  const {
    handleSubmit,
    control,
    formState,
    reset: resetForm,
    watch,
  } = useForm<{ name: string; body: string }>({
    defaultValues: {
      name: mode === 'create' ? '' : task.name,
      body: mode === 'create' ? '' : task.body || '',
    },
    resolver: zodResolver(mode === 'create' ? createTaskZ : updateTaskZ),
  });

  const name = watch('name');
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

  const closeFormOnEsc = (e: React.KeyboardEvent<HTMLInputElement> | KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsFormOpen(false);
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
        base: cn(
          'shrink-0 overflow-scroll outline-1 outline-default-400 outline-solid',
          inModal && 'grow',
          // grow only if is **main task in modal**, since flex container is horizontal
          // that means subtask's form in modal won't count, because inModal is still false in that case
        ),
        body: cn('gap-2 overflow-scroll p-2'),
        footer: cn('sticky bottom-0 flex-col items-end gap-2 overflow-hidden bg-content1 p-2'),
      }}
      id="TaskForm"
      radius="sm"
      shadow="none"
      style={{ marginLeft: parentTaskId ? 0 : finalIndent }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
      >
        <CardBody>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Textarea
                {...field}
                autoFocus
                classNames={{
                  input: cn('font-medium', inModal && `
                    text-base
                    xs:text-lg
                  `),
                }}
                errorMessage={formState.errors.name?.message}
                isInvalid={Boolean(formState.errors.name)}
                maxRows={3}
                minRows={1}
                onKeyDown={closeFormOnEsc}
                placeholder="Task name"
                radius="sm"
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
                maxRows={15}
                minRows={1}
                onKeyDown={closeFormOnEsc}
                placeholder="Body"
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
              isDisabled={!formState.isDirty || name === ''}
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
