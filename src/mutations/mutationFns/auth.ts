import type { AuthPayload } from '../../types/dataSchemas';
import { resSignInZ } from '../../types/resSchemas';
import { server } from '../../utils/serverUrl';

export async function signIn(data: AuthPayload) {
  const res = await fetch(`${server}/auth/signin`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  }).then(res => res.json());

  const validRes = resSignInZ.parse(res);

  if (validRes.status === 'success')
    return validRes.data;

  // type check, because Prisma throws errors as objects, not strings
  throw new Error(validRes.error && typeof validRes.error === 'string' ? validRes.error : validRes.message);
}

export async function signUp(data: AuthPayload) {
  const res = await fetch(`${server}/auth/signup`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  }).then(res => res.json());

  return res;
}
