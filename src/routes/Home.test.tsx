import { cleanup, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';

import getProjects from '../queries/queryFns/getProjects';
import getUser from '../queries/queryFns/getUser';
import { genProjects, userFactory } from '../test/fakeData';
import { renderWithProviders } from '../test/renderWithProviders';

vi.mock('../queries/queryFns/getUser.ts');
vi.mock('../queries/queryFns/getProjects.ts');

afterEach(cleanup);

test('redirect to /auth if not logged in', async () => {
  vi.mocked(getUser).mockResolvedValue(null);
  renderWithProviders();

  const auth = await screen.findByTestId('Auth');
  await waitFor(() => expect(auth).toBeInTheDocument());
});

test('display NoProject if logged in', async () => {
  vi.mocked(getUser).mockResolvedValue(userFactory());
  vi.mocked(getProjects).mockResolvedValue(genProjects());
  renderWithProviders();

  const noProject = await screen.findByTestId('NoProject');
  await waitFor(() => expect(noProject).toBeInTheDocument());
});
