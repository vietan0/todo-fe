import { resGetUserZ } from '../types/resSchemas';
import { devServer } from '../utils/serverUrl';

import type { User } from '../types/dataSchemas';

export default async function getUser(): Promise<User | null> {
  const res = await fetch(
    `${devServer}/api/user`,
    { credentials: 'include' },
  ).then(res => res.json());

  const validRes = resGetUserZ.parse(res);

  if (validRes.status === 'success')
    return validRes.data;

  return null;
}
