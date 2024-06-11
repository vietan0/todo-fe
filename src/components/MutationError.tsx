import { Code } from '@nextui-org/react';

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
      <Code color="danger" className="whitespace-normal text-[12px]">{mutationName}</Code>
      :
      <Code color="danger" className="whitespace-normal text-[12px]">{JSON.stringify(error.message, null, 2)}</Code>
    </p>
  );
}
