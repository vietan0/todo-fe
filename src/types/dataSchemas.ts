import { z } from 'zod';

export const authPayloadZ = z.object({
  email: z.string().email().max(255),
  password: z.string(),
});
export type AuthPayload = z.infer<typeof authPayloadZ>;
export const userZ = z.object({
  id: z.string().uuid(),
  email: z.string().email().max(255),
  password: z.string().trim().min(4).max(255),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type User = z.infer<typeof userZ>;

const taskScalarZ = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(255),
  body: z.string().nullable(),
  completed: z.boolean(),
  lexorank: z.string().trim().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  projectId: z.string().uuid(),
  parentTaskId: z.string().uuid().nullable(),
});

export type TaskScalar = z.infer<typeof taskScalarZ>;
export const taskZ = taskScalarZ.extend({
  subTasks: z.array(taskScalarZ),
});
export type Task = z.infer<typeof taskZ>;
export const projectScalarZ = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1).max(255),
  lexorank: z.string().trim().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  userId: z.string().uuid(),
});
export type ProjectScalar = z.infer<typeof projectScalarZ>;
export const projectZ = projectScalarZ.extend({
  tasks: z.array(taskZ),
});
export type Project = z.infer<typeof projectZ>;
export const createProjectZ = z.object({
  name: z.string().trim().min(1).max(255),
});
export type CreateProject = z.infer<typeof createProjectZ>;
export const updateProjectZ = z.object({
  name: z.string().trim().min(1).max(255).optional(),
  lexorank: z.string().trim().min(1).optional(),
});
export type UpdateProject = z.infer<typeof updateProjectZ>;
export const createTaskZ = z.object({
  name: z.string().trim().min(1).max(255),
  body: z.string().optional(),
  parentTaskId: z.string().uuid().optional(),
});
export type CreateTask = z.infer<typeof createTaskZ>;
export const updateTaskZ = z.object({
  name: z.string().trim().min(1).max(255).optional(),
  body: z.string().optional(),
  completed: z.boolean().optional(),
  lexorank: z.string().trim().min(1).optional(),
  projectId: z.string().uuid().optional(),
  parentTaskId: z.string().uuid().nullable().optional(),
});
export type UpdateTask = z.infer<typeof updateTaskZ>;
