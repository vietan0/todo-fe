import { devServer } from './serverUrl';

export default async function getUser() {
  const res = await fetch(`${devServer}/api/user`, {
    credentials: 'include',
  }).then(res => res.json());

  return res;
}
