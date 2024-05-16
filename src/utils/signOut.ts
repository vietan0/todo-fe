import { devServer } from './serverUrl';

export default async function signOut() {
  const res = await fetch(`${devServer}/auth/signout`, { method: 'POST', credentials: 'include' }).then(res => res.json());

  return res;
}
