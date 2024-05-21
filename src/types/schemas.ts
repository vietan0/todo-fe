import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().max(255),
  password: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type User = z.infer<typeof userSchema>;

const taskScalarSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(255),
  completed: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  projectId: z.string().uuid(),
  parentTaskId: z.string().uuid().nullable(),
});

export const taskSchema = taskScalarSchema.extend({
  subTasks: z.array(taskScalarSchema),
});
export type Task = z.infer<typeof taskSchema>;
export const projectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(255),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  userId: z.string().uuid(),
  tasks: z.array(taskSchema),
});
export type Project = z.infer<typeof projectSchema>;
export const resErrSchema = z.object({
  status: z.literal('error'),
  message: z.string(),
  error: z.string().optional(),
});
export const getUserSchema = z.union([
  z.object({
    status: z.literal('success'),
    data: userSchema,
  }),
  resErrSchema,
]);
export const getProjectsSchema = z.union([
  z.object({
    status: z.literal('success'),
    data: z.array(projectSchema),
  }),
  resErrSchema,
]);
