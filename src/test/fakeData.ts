import { faker } from '@faker-js/faker';

import type { Project, ProjectScalar, Task, User } from '../types/dataSchemas';

export function userFactory(user?: Partial<User>): User {
  return {
    id: user?.id || faker.string.uuid(),
    email: user?.email || faker.internet.email(),
    password: user?.password || faker.string.hexadecimal(),
    createdAt: user?.createdAt || faker.date.past().toISOString(),
    updatedAt: user?.updatedAt || faker.date.past().toISOString(),
  };
}

export function subTaskFactory(parentTaskId: string): Task {
  return {
    id: faker.string.uuid(),
    name: `${faker.word.adjective()} ${faker.word.noun()}`,
    completed: faker.datatype.boolean(),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.past().toISOString(),
    projectId: faker.string.uuid(),
    parentTaskId,
    subTasks: [],
  };
}

export function baseTaskFactory(subTasks = 0): Task {
  const taskId = faker.string.uuid();

  return {
    id: taskId,
    name: `${faker.word.adjective()} ${faker.word.noun()}`,
    completed: faker.datatype.boolean(),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.past().toISOString(),
    projectId: faker.string.uuid(),
    parentTaskId: null,
    subTasks: genSubTasks(taskId, subTasks),
  };
}

export function genSubTasks(parentTaskId: string, length = 0): Task[] {
  return Array.from({ length }, () => subTaskFactory(parentTaskId));
}

export function genBaseTasks(length = 0): Task[] {
  return Array.from({ length }, () => baseTaskFactory());
}

export function projectFactory(scalarOnly = false): ProjectScalar | Project {
  return {
    id: faker.string.uuid(),
    name: `${faker.word.adjective()} ${faker.word.noun()}`,
    userId: faker.string.uuid(),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.past().toISOString(),
    tasks: scalarOnly ? genBaseTasks() : undefined,
  };
}

export function genProjects(length = 0, scalarOnly = false): ProjectScalar[] | Project[] {
  return Array.from({ length }, () => projectFactory(scalarOnly));
}
