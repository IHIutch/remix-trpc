import { TRPCError, initTRPC } from '@trpc/server'
import superjson from 'superjson'
import type { Session, User } from '@supabase/supabase-js'
import { Prisma } from '@prisma/client'
import { createClient } from './supabase/supabase.server'
import { prisma } from './prisma.server'

const _user = Prisma.validator<Prisma.UsersDefaultArgs>()({
  omit: {
    id: true,
  },
})

type UserWithoutId = Prisma.UsersGetPayload<typeof _user> & {
  email: User['email']
}

interface CreateInnerContextOptions {
  user?: UserWithoutId | null
  session?: Session | null
}

export async function createContextInner(opts: CreateInnerContextOptions) {
  return {
    ...opts,
  }
}

// export async function createContext(ctx: FetchCreateContextFnOptions) {
//   const { supabaseClient } = createClient(ctx.req)

//   const {
//     data: { user },
//   } = await supabaseClient.auth.getUser()

//   const contextInner = await createContextInner({
//     user,
//   })

//   return {
//     ...contextInner,
//     ...ctx,
//   }
// }

export async function createContext_v2(request: Request) {
  const { supabaseClient } = createClient(request)

  const {
    data: { user },
  } = await supabaseClient.auth.getUser()

  if (!user) {
    return {
      user: null,
    }
  }

  const data = await prisma.users.findUnique({
    omit: {
      id: true,
    },
    where: {
      id: user.id,
    },
  })

  if (!data) {
    return {
      user: null,
    }
  }

  return {
    user: {
      ...data,
      email: user.email,
    },
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
