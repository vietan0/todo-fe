import { z } from 'zod';

import { projectScalarZ, projectZ, taskZ, userZ } from './dataSchemas';

import type { ZodTypeAny } from 'zod';

export function resSuccessZ(dataZ: ZodTypeAny) {
  return z.object({
    status: z.literal('success'),
    data: dataZ,
  });
}

export const resErrZ = z.object({
  status: z.literal('error'),
  message: z.string(),
  error: z.string().optional(),
});
export const resGetUserZ = z.union([resSuccessZ(userZ), resErrZ]);
export const resGetProjectsZ = z.union([resSuccessZ(z.array(projectScalarZ)), resErrZ]);
export const resGetProjectZ = z.union([resSuccessZ(projectZ), resErrZ]);
export const resCreateProjectZ = z.union([resSuccessZ(projectZ), resErrZ]);
export const resRenameProjectZ = z.union([resSuccessZ(projectZ), resErrZ]);
export const resDeleteProjectZ = z.union([resSuccessZ(projectZ), resErrZ]);
export const resGetTaskZ = z.union([resSuccessZ(taskZ), resErrZ]);
export const resCreateTaskZ = z.union([resSuccessZ(taskZ), resErrZ]);
export const resUpdateTaskZ = z.union([resSuccessZ(taskZ), resErrZ]);
export const resDeleteTaskZ = z.union([resSuccessZ(taskZ), resErrZ]);
