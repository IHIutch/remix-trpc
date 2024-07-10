import { z } from 'zod'
import { prisma } from '../prisma.server'
import { publicProcedure, router } from '#/utils/trpc.server'

export const reportsRouter = router({
  getAll: publicProcedure.query(async () => {
    return await prisma.reports.findMany({
      orderBy: {
        id: 'asc',
      },
    })
  }),
  getById: publicProcedure.input(
    z.object({
      where: z.object({
        id: z.number(),
      }),
    }),
  ).query(async ({ input }) => {
    const { where } = input
    return await prisma.reports.findFirst({
      where,
    })
  }),
})
