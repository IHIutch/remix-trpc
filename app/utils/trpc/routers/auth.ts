import { prisma } from '#/utils/prisma.server'
import { authedProcedure, router } from '#/utils/trpc.server'

export const authRouter = router({
  getAuthedUser: authedProcedure.query(async ({ ctx }) => {
    return await prisma.users.findUnique({
      omit: {
        id: true,
      },
      where: {
        id: ctx.user.id,
      },
    })
  }),
})
