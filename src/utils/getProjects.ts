import { devServer } from './serverUrl';

export default async function getProjects() {
  const res = await fetch(
    `${devServer}/api/project`,
    { credentials: 'include' },
  ).then(res => res.json());

  if (res.status === 'success')
    return res.data;

  throw new Error(res.message);
}
