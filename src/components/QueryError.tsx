import { Code } from '@heroui/react';

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
      <Code className="whitespace-normal text-xs" color="danger">{queryName}</Code>
      :
      <Code className="whitespace-normal text-xs" color="danger">{JSON.stringify(error.message, null, 2)}</Code>
    </p>
  );
}
