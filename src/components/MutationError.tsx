import { Code } from '@heroui/react';

export default function MutationError({
  error,
  mutationName,
}: {
  error: Error;
  mutationName: string;
}) {
  console.error(error);

  return (
    <p className="text-sm text-danger" data-testid="MutationError">
      There's been an error with mutation
      {' '}
      <Code className="whitespace-normal text-xs" color="danger">{mutationName}</Code>
      :
      <Code className="whitespace-normal text-xs" color="danger">{JSON.stringify(error.message, null, 2)}</Code>
    </p>
  );
}
