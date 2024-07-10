import { TRPCError, initTRPC } from '@trpc/server'
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import superjson from 'superjson'
import { createClient } from './supabase.server'

export async function createContext(ctx: FetchCreateContextFnOptions) {
  const supabase = createClient(ctx.req)

  const {
    data: { user },
  } = await supabase.auth.getUser()
  return {
    ...ctx,
    user,
  }
}

type Context = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<Context>().create({ transformer: superjson })

export const router = t.router
export const publicProcedure = t.procedure
export const authedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next()
})
