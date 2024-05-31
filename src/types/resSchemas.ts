import { z } from 'zod';

import { projectZ, taskZ, userZ } from './dataSchemas';

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
export const resGetProjectsZ = z.union([resSuccessZ(z.array(projectZ)), resErrZ]);
export const resCreateProjectZ = z.union([resSuccessZ(projectZ), resErrZ]);
export const resRenameProjectZ = z.union([resSuccessZ(projectZ), resErrZ]);
export const resDeleteProjectZ = z.union([resSuccessZ(projectZ), resErrZ]);
export const resCreateTaskZ = z.union([resSuccessZ(taskZ), resErrZ]);
export const resCompleteTaskZ = z.union([resSuccessZ(taskZ), resErrZ]);
