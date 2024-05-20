import { getUserSchema } from '../types/schemas';
import { devServer } from '../utils/serverUrl';

import type { User } from '../types/schemas';

export default async function getUser(): Promise<User | null> {
  const res = await fetch(
    `${devServer}/api/user`,
    { credentials: 'include' },
  ).then(res => res.json());

  const validRes = getUserSchema.parse(res);

  if (validRes.status === 'success')
    return validRes.data;

  return null;
}
