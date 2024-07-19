import { z } from 'zod'
import { prisma } from '#/utils/prisma.server'
import { publicProcedure, router } from '#/utils/trpc'

export const changelogRouter = router({
  getByReportId: publicProcedure.input(
    z.object({
      objectId: z.number(),
    }),
  ).query(async ({ input }) => {
    const { objectId } = input
    return await prisma.changelog.findMany({
      where: {
        objectId,
        objectType: 'REPORT',
        objectAttr: 'status',
      },
      include: {
        users: true,
      },
      orderBy: {
        id: 'asc',
      },
    })
  }),
})
