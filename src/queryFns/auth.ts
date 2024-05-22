import { devServer } from '../utils/serverUrl';

import type { AuthPayload } from '../routes/Auth';

export async function signIn(data: AuthPayload) {
  const res = await fetch(`${devServer}/auth/signin`, {
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

export async function signUp(data: AuthPayload) {
  const res = await fetch(`${devServer}/auth/signup`, {
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

export async function signOut() {
  const res = await fetch(`${devServer}/auth/signout`, { method: 'POST', credentials: 'include' }).then(res => res.json());

  return res;
}
