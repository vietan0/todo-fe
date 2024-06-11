import { server } from '../../utils/serverUrl';

export default async function signOut() {
  const res = await fetch(
    `${server}/auth/signout`,
    { method: 'POST', credentials: 'include' },
  ).then(res => res.json());

  return res;
}
