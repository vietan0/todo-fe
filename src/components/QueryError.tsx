import { Code } from '@nextui-org/react';

export default function QueryError({
  error,
  queryName,
}: {
  error: Error;
  queryName: string;
}) {
  console.error(error);

  return (
    <p className="text-sm text-danger">
      There's been an error with query
      {' '}
      <Code className="whitespace-normal text-[12px]" color="danger">{queryName}</Code>
      :
      <Code className="whitespace-normal text-[12px]" color="danger">{JSON.stringify(error.message, null, 2)}</Code>
    </p>
  );
}
