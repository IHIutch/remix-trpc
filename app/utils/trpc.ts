import { TRPCError, initTRPC } from '@trpc/server'
import superjson from 'superjson'
import type { User } from '@supabase/supabase-js'
import { createClient } from './supabase/supabase.server'

// type UserWithoutId = Prisma.UsersGetPayload<typeof _user> & {
//   email: User['email']
// }

interface CreateInnerContextOptions {
  user?: User | null
}

export async function createContextInner(opts: CreateInnerContextOptions) {
  return {
    ...opts,
  }
}

export async function createContext(request: Request) {
  const { supabaseClient } = createClient(request)

  const {
    data: { user },
  } = await supabaseClient.auth.getUser()

  const contextInner = await createContextInner({
    user,
  })

  return {
    ...contextInner,
  }
}

export type Context = Awaited<ReturnType<typeof createContextInner>>

const t = initTRPC.context<Context>().create({ transformer: superjson })

export const router = t.router
export const createCallerFactory = t.createCallerFactory

export const publicProcedure = t.procedure
export const authedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  })
})
