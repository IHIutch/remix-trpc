import { reportsRouter } from './reports'
import { authRouter } from './auth'
import { router } from '#/utils/trpc.server'

export const appRouter = router({
  auth: authRouter,
  reports: reportsRouter,
  // comments:
})

export type AppRouter = typeof appRouter
