import type { User } from '../../types/dataSchemas';
import { resGetUserZ } from '../../types/resSchemas';
import { server } from '../../utils/serverUrl';

export default async function getUser(): Promise<User | null> {
  const res = await fetch(
    `${server}/api/user`,
    { credentials: 'include' },
  ).then(res => res.json());

  const validRes = resGetUserZ.parse(res);

  if (validRes.status === 'success')
    return validRes.data;

  if (validRes.status === 'error' && validRes.message === 'Token doesn\'t exist')
    return null;

  throw new Error('Error while fetching user');
}
