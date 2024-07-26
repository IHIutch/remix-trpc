import { prisma } from '#/utils/prisma.server'
import { publicProcedure, router } from '#/utils/trpc'

export const authRouter = router({
  getAuthedUser: publicProcedure.query(async ({ ctx }) => {
    if (!ctx?.user?.id) {
      return null
    }

    return await prisma.users.findUnique({
      where: {
        id: ctx.user.id,
      },
      omit: {
        id: true,
      },
    })
  }),
})
