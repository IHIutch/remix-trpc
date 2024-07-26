import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { reportsRouter } from './reports'
import { authRouter } from './auth'
import { commentsRouter } from './comments'
import { changelogRouter } from './changelog'
import { reportTypesRouter } from './report-types'
import { router } from '#/utils/trpc'

export const appRouter = router({
  auth: authRouter,
  reports: reportsRouter,
  comments: commentsRouter,
  changelog: changelogRouter,
  reportTypes: reportTypesRouter,
})

export type AppRouter = typeof appRouter

export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
