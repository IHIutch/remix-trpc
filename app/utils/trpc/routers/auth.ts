import { publicProcedure, router } from '#/utils/trpc'

export const authRouter = router({
  getAuthedUser: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      return null
    }

    return {
      ...ctx.user,
    }
  }),
})
