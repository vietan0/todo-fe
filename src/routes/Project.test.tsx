import type { Project } from '../types/dataSchemas';
import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import createProject from '../mutations/mutationFns/createProject';
import getProject from '../queries/queryFns/getProject';
import getProjects from '../queries/queryFns/getProjects';
import getUser from '../queries/queryFns/getUser';
import { genProjects, projectFactory, userFactory } from '../test/fakeData';

import { renderWithProviders } from '../test/renderWithProviders';

vi.mock('../queries/queryFns/getUser.ts');
vi.mock('../queries/queryFns/getProjects.ts');
vi.mock('../queries/queryFns/getProject.ts');
vi.mock('../mutations/mutationFns/createProject.ts');
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
  const createProjectBtn = await screen.findByLabelText('Create Project');
  await user.click(createProjectBtn);
  const projectNameInput = await screen.findByLabelText('Name');
  await user.type(projectNameInput, 'New Project');

  const newFakeProject = projectFactory();
  vi.mocked(createProject).mockResolvedValue(newFakeProject as Project);
  vi.mocked(getProjects).mockResolvedValue([...fakeProjects, newFakeProject]);
  vi.mocked(getProject).mockResolvedValue(newFakeProject as Project);
  await user.click(screen.getByText('Create'));

  expect(createProject).toHaveBeenCalledTimes(1);
  expect(getProjects).toHaveBeenCalledTimes(2);

  // should see new row in Sidebar's project list
  const newProjectBtn = await screen.findByRole('button', { name: newFakeProject.name });
  expect(newProjectBtn).toBeInTheDocument();

  // should redirect to /project/:projectId
  const newProjectH1 = await screen.findByRole('heading', {
    name: newFakeProject.name,
  });

  await waitFor(() => expect(newProjectH1).toBeInTheDocument());
  await waitFor(() => expect(getProject).toHaveBeenCalledTimes(1));
});

test('create project without name', async () => {
  const createProjectBtn = await screen.findByLabelText('Create Project');
  await user.click(createProjectBtn);
  const projectNameInput = await screen.findByLabelText('Name');
  await user.clear(projectNameInput);
  await user.click(screen.getByText('Create'));

  expect(createProject).not.toHaveBeenCalled();
  expect(getProject).not.toHaveBeenCalled();

  const errMsg = await screen.findByText('String must contain at least 1 character(s)');
  expect(errMsg).toBeInTheDocument();
});
