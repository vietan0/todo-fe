import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { signIn } from '../queries/auth';
import getProjects from '../queries/getProjects';
import getUser from '../queries/getUser';
import { genProjects, userFactory } from '../test/fakeData';
import { renderWithProviders } from '../test/renderWithProviders';

vi.mock('../queries/getUser.ts');
vi.mock('../queries/auth.ts');
vi.mock('../queries/getProjects.ts');
const user = userEvent.setup();

beforeEach(async () => {
  vi.clearAllMocks();
  vi.mocked(getUser).mockResolvedValue(null);
  renderWithProviders();
  const auth = await screen.findByTestId('Auth');
  await waitFor(() => expect(auth).toBeInTheDocument());
});

afterEach(() => {
  cleanup();
});

test('sign in successfully', async () => {
  const fakeUser = userFactory();
  const signInButton = await screen.findByRole('button', { name: 'Sign In' });
  vi.mocked(getUser).mockResolvedValue(fakeUser);
  vi.mocked(getProjects).mockResolvedValue(genProjects());
  await user.click(signInButton);
  expect(signIn).toHaveBeenCalled();
  const home = await screen.findByTestId('Home');
  await waitFor(() => expect(home).toBeInTheDocument());
});

test('sign in without email should display error', async () => {
  const emailInput = await screen.findByLabelText('Email');
  const signInButton = await screen.findByRole('button', { name: 'Sign In' });

  await user.clear(emailInput);
  await user.click(signInButton);

  expect(signIn).not.toHaveBeenCalled();
  const errMsg = await screen.findByText('Invalid email');
  expect(errMsg).toBeInTheDocument();
});

test('sign in with non-existing email', async () => {
  const emailInput = await screen.findByLabelText('Email');
  const signInButton = await screen.findByRole('button', { name: 'Sign In' });
  vi.mocked(signIn).mockRejectedValue(new Error('No User found'));

  await user.clear(emailInput);
  await user.type(emailInput, 'nonExisting@email.com');
  await user.click(signInButton);

  expect(signIn).toHaveBeenCalled();
  await waitFor(() => expect(signIn).toHaveBeenCalled());
  const mutationErr = await screen.findByTestId('MutationError');
  expect(mutationErr).toBeInTheDocument();
});

test('sign in with incorrect password', async () => {
  const passwordInput = await screen.findByLabelText('Password');
  const signInButton = await screen.findByRole('button', { name: 'Sign In' });
  vi.mocked(signIn).mockRejectedValue(new Error('No User found'));

  await user.clear(passwordInput);
  await user.type(passwordInput, 'wrongPassword');
  await user.click(signInButton);

  expect(signIn).toHaveBeenCalled();
  await waitFor(() => expect(signIn).toHaveBeenCalled());
  const mutationErr = await screen.findByTestId('MutationError');
  expect(mutationErr).toBeInTheDocument();
});
