import { devServer } from './serverUrl';

export default async function getUser() {
  const res = await fetch(
    `${devServer}/api/user`,
    { credentials: 'include' },
  ).then(res => res.json());

  if (res.status === 'success')
    return res.data;

  return null;
}
