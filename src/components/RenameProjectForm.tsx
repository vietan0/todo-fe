import type { SubmitHandler } from 'react-hook-form';
import type { Project, UpdateProject } from '../types/dataSchemas';
import { CircularProgress, Input } from '@heroui/react';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import useUpdateProjectMutation from '../mutations/useUpdateProjectMutation';
import { updateProjectZ } from '../types/dataSchemas';
import cn from '../utils/cn';
import MutationError from './MutationError';

export default function RenameProjectForm({
  project,
  setIsFormOpen,
}: {
  project: Project;
  setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { handleSubmit, control, formState } = useForm<{ name: string }>({
    defaultValues: { name: project.name },
    resolver: zodResolver(updateProjectZ),
  });

  const renameProjectMutation = useUpdateProjectMutation();

  const onSubmit: SubmitHandler<UpdateProject> = (data) => {
    if (data.name === project.name)
      setIsFormOpen(false);
    else
      renameProjectMutation.mutate({ data, projectId: project.id });
  };

  const closeFormOnEsc = (e: React.KeyboardEvent<HTMLInputElement> | KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsFormOpen(false);
    }
  };

  useEffect(() => {
    if (renameProjectMutation.isSuccess) {
      setIsFormOpen(false);
    }
  }, [renameProjectMutation.isSuccess]);

  return (
    <div
      className="flex flex-col gap-2"
      onBlur={() => setIsFormOpen(false)}
    >
      <form
        className="flex gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <Input
              {...field}
              autoFocus
              classNames={{
                input: cn(`
                  text-base font-bold
                  xs:text-2xl
                `),
                inputWrapper: cn(`
                  px-1 py-0
                  group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-transparent
                  group-data-[focus-visible=true]:ring-offset-0 group-data-[focus-visible=true]:ring-offset-transparent
                `),
              }}
              endContent={
                renameProjectMutation.isPending && (
                  <CircularProgress
                    aria-label="Loading"
                    classNames={{ svg: 'size-6' }}
                  />
                )
              }
              errorMessage={formState.errors.name?.message}
              isInvalid={Boolean(formState.errors.name)}
              onKeyDown={closeFormOnEsc}
              placeholder="Task name"
              radius="sm"
            />
          )}
        />
        {import.meta.env.PROD || <DevTool control={control} />}
      </form>
      {renameProjectMutation.isError && (
        <MutationError
          error={renameProjectMutation.error}
          mutationName="renameProject"
        />
      )}
    </div>
  );
}
