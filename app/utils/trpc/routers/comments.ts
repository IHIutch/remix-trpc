import { z } from 'zod'
import { prisma } from '#/utils/prisma.server'
import { authedProcedure, publicProcedure, router } from '#/utils/trpc'

export const commentsRouter = router({
  getByReportId: publicProcedure.input(
    z.object({
      objectId: z.number(),
    }),
  ).query(async ({ input }) => {
    const { objectId } = input
    return await prisma.comments.findMany({
      where: {
        objectId,
        objectType: 'REPORT',
      },
      include: {
        users: {
          omit: {
            id: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    })
  }),
  create: authedProcedure.input(
    z.object({
      payload: z.object({
        objectType: z.literal('REPORT'),
        objectId: z.number(),
        content: z.string(),
        replyTo: z.number().optional(),
      }),
    }),

  ).mutation(async ({ input, ctx }) => {
    const { payload } = input
    return await prisma.comments.create({
      data: {
        ...payload,
        creatorId: ctx.user.publicId,
      },
      include: {
        users: true,
      },
    })
  }),
})
