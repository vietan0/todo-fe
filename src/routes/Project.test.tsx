import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import createProject from '../queries/createProject';
import getProject from '../queries/getProject';
import getProjects from '../queries/getProjects';
import getUser from '../queries/getUser';
import { genProjects, projectFactory, userFactory } from '../test/fakeData';
import { renderWithProviders } from '../test/renderWithProviders';

import type { Project } from '../types/dataSchemas';

vi.mock('../queries/getUser.ts');
vi.mock('../queries/getProjects.ts');
vi.mock('../queries/createProject.ts');
vi.mock('../queries/getProject.ts');
const user = userEvent.setup();
const fakeProjects = genProjects();
const fakeUser = userFactory();

beforeEach(async () => {
  vi.clearAllMocks();
  vi.mocked(getUser).mockResolvedValue(fakeUser);
  vi.mocked(getProjects).mockResolvedValue(fakeProjects);

  renderWithProviders();
  const noProject = await screen.findByTestId('NoProject');
  await waitFor(() => expect(noProject).toBeInTheDocument());
});

afterEach(cleanup);

test('create project successfully', async () => {
  const createProjectBtn = await screen.findByLabelText('Add Project');
  await user.click(createProjectBtn);
  const projectNameInput = await screen.findByLabelText('Name');
  await user.type(projectNameInput, 'New Project');

  const newFakeProject = projectFactory();
  vi.mocked(createProject).mockResolvedValue(newFakeProject as Project);
  vi.mocked(getProjects).mockResolvedValue([...fakeProjects, newFakeProject]);
  vi.mocked(getProject).mockResolvedValue(newFakeProject as Project);
  await user.click(screen.getByText('Create'));

  // should see new row in Sidebar's project list
  const newProjectBtn = await screen.findByRole('button', { name: newFakeProject.name });
  expect(newProjectBtn).toBeInTheDocument();

  // should redirect to /project/:projectId
  const newProjectH1 = await screen.findByRole('heading', {
    name: newFakeProject.name,
  });

  await waitFor(() => expect(newProjectH1).toBeInTheDocument());
});

test.todo('create project without name should display error');
