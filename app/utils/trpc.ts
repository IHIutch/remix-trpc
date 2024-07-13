import { TRPCError, initTRPC } from '@trpc/server'
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import superjson from 'superjson'
import type { User } from '@supabase/supabase-js'
import { createClient } from './supabase/supabase.server'

interface CreateInnerContextOptions {
  user?: User | null
}

export async function createContextInner(opts: CreateInnerContextOptions) {
  return {
    ...opts,
  }
}

export async function createContext(ctx: FetchCreateContextFnOptions) {
  const { supabaseClient } = createClient(ctx.req)

  const {
    data: { user },
  } = await supabaseClient.auth.getUser()

  const contextInner = await createContextInner({
    user,
  })

  return {
    ...contextInner,
    ...ctx,
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
