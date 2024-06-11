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
      <Code color="danger" className="whitespace-normal text-[12px]">{queryName}</Code>
      :
      <Code color="danger" className="whitespace-normal text-[12px]">{JSON.stringify(error.message, null, 2)}</Code>
    </p>
  );
}
