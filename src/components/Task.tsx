import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, Card, CardBody, CardFooter, Checkbox, CircularProgress, Code, Input } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import useCompleteTaskMutation from '../queries/useCompleteTaskMutation';
import useCreateTaskMutation from '../queries/useCreateTaskMutation';
// eslint-disable-next-line import/no-duplicates
import { type Task as TaskT, createTaskZ } from '../types/dataSchemas';
import cn from '../utils/cn';

// eslint-disable-next-line import/no-duplicates
import type { CreateTask } from '../types/dataSchemas';
import type { SubmitHandler } from 'react-hook-form';

export default function Task({ task, onOpen }: { task: TaskT; onOpen: () => void }) {
  const completeTaskMutation = useCompleteTaskMutation(task.id);
  const nav = useNavigate();
  const [isHover, setIsHover] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const params = useParams<'projectId' | 'taskId'>();
  const createTaskMutation = useCreateTaskMutation(params.projectId || '');

  const {
    handleSubmit,
    control,
    formState,
    reset: resetForm,
  } = useForm<CreateTask>({
    defaultValues: { name: '' },
    resolver: zodResolver(createTaskZ),
  });

  const onSubmit: SubmitHandler<CreateTask> = (data) => {
    createTaskMutation.mutate({
      name: data.name,
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
      onPress={() => {
        nav(`task/${task.id}`);
        onOpen();
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onFocus={() => setIsHover(true)}
      onBlur={() => setIsHover(false)}
      radius="sm"
      variant="bordered"
      disableAnimation
      className={cn(
        task.completed ? 'opacity-disabled' : 'hover:bg-default-100',
        'h-auto min-h-[55px] items-start justify-start p-3 text-start',
      )}
      endContent={isHover && (
        <div className="ml-auto flex gap-1.5">
          <Button
            isIconOnly
            aria-label="Edit Task"
            variant="light"
            radius="sm"
            size="sm"
            // eslint-disable-next-line tailwindcss/enforces-shorthand
            className="h-7 w-7 min-w-0 data-[hover=true]:bg-default/60"
            disableAnimation
          >
            <Icon icon="material-symbols:edit" className="text-xl text-default-700" />
          </Button>
          <Button
            isIconOnly
            aria-label="Delete Task"
            variant="light"
            radius="sm"
            size="sm"
            // eslint-disable-next-line tailwindcss/enforces-shorthand
            className="h-7 w-7 min-w-0 data-[hover=true]:bg-default/60"
            disableAnimation
          >
            <Icon icon="material-symbols:delete" className="text-xl text-default-700" />
          </Button>
        </div>
      )}
    >
      <Checkbox
        radius="full"
        id={task.id}
        classNames={{
          base: 'outline-1 outline-red-400',
          wrapper: 'mr-0',
        }}
        isSelected={task.completed}
        onValueChange={
          (isSelected: boolean) => {
            completeTaskMutation.mutate(isSelected);
          }
        }
      />
      <div>
        <p>{task.name}</p>
        {task.parentTaskId
        && (
          <div>
            <span>
              parent:
              {' '}
            </span>
            <Code className="text-xs">{task.parentTaskId}</Code>
          </div>
        )}
      </div>
      {completeTaskMutation.isPending && (
        <CircularProgress
          aria-label="Loading"
          classNames={{
            base: 'self-center ml-auto',
            svg: 'w-5 h-5',
          }}
        />
      )}
    </Button>
  );
}
