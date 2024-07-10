import { reportsRouter } from './reports'
import { router } from '#/utils/trpc.server'

export const appRouter = router({
  reports: reportsRouter,
  // comments:
})

export type AppRouter = typeof appRouter
