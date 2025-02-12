import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './context';
import superjson from 'superjson';
import { UserRole } from '@prisma/client';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;

/**
 * Reusable middleware to ensure
 * users are logged in
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Reusable middleware to ensure the user is staff
 */
const isStaff = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user || ctx.session?.user?.role != UserRole.STAFF) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/** Includes intern */
const isNotStudent = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user || ctx.session?.user?.role === UserRole.STUDENT) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

const isStudent = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user || ctx.session?.user?.role !== UserRole.STUDENT) {
	throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
	ctx: {
	  session: { ...ctx.session, user: ctx.session.user },
	},
  });
});

/**
 * Protected procedure
 **/
export const protectedProcedure = t.procedure.use(isAuthed);

export const protectedStaffProcedure = t.procedure.use(isStaff);

export const protectedNotStudentProcedure = t.procedure.use(isNotStudent);

export const protectedStudentProcedure = t.procedure.use(isStudent);
