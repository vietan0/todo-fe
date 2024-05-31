import { z } from 'zod';

export const userZ = z.object({
  id: z.string().uuid(),
  email: z.string().email().max(255),
  password: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type User = z.infer<typeof userZ>;

const taskScalarZ = z.object({
  id: z.string().uuid(),
  name: z.string().max(255),
  completed: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  projectId: z.string().uuid(),
  parentTaskId: z.string().uuid().nullable(),
});

export const taskZ = taskScalarZ.extend({
  subTasks: z.array(taskScalarZ),
});
export type Task = z.infer<typeof taskZ>;
export const projectZ = z.object({
  id: z.string().uuid(),
  name: z.string().max(255),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  userId: z.string().uuid(),
  tasks: z.array(taskZ),
});
export type Project = z.infer<typeof projectZ>;
export const createProjectZ = z.object({
  name: z.string().trim().min(1).max(255),
});
export type CreateProject = z.infer<typeof createProjectZ>;
export const renameProjectZ = z.object({
  name: z.string().max(255),
});
export type RenameProject = z.infer<typeof renameProjectZ>;
export const completeTaskZ = z.object({
  completed: z.boolean(),
});
export type CompleteTask = z.infer<typeof completeTaskZ>;
