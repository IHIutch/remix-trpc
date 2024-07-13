import { z } from 'zod'
import { publicProcedure, router } from '#/utils/trpc.server'
import { prisma } from '#/utils/prisma.server'

export const reportsRouter = router({
  getAll: publicProcedure.query(async () => {
    return await prisma.reports.findMany({
      orderBy: {
        id: 'asc',
      },
      include: {
        reportTypes: true,
      },
    })
  }),
  getById: publicProcedure.input(
    z.object({
      id: z.number(),
    }),
  ).query(async ({ input }) => {
    const { id } = input
    return await prisma.reports.findUnique({
      where: {
        id,
      },
    })
  }),
})
