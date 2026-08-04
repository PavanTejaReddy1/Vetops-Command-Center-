/**
 * Request validation schemas — PHASE 2.
 *
 * Placeholder so the pattern is established: use zod (same library as the
 * frontend's react-hook-form + zod setup) to validate request bodies
 * before they reach a controller.
 *
 * Example (for Phase 2 reference):
 *
 * import { z } from 'zod';
 *
 * export const createTaskSchema = z.object({
 *   title: z.string().min(1),
 *   assigneeId: z.string(),
 *   priority: z.enum(['low', 'medium', 'high', 'urgent']),
 *   dueAt: z.string().datetime(),
 * });
 */
export const validators = {};
