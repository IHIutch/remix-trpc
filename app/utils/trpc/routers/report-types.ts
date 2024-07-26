import { publicProcedure, router } from '#/utils/trpc'
import { prisma } from '#/utils/prisma.server'

export const reportTypesRouter = router({
  getAll: publicProcedure.query(async () => {
    return await prisma.reportTypes.findMany({
      orderBy: [{
        group: 'asc',
      }, {
        name: 'asc',
      }],
    })
  }),
})
