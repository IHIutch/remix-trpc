import { z } from 'zod'
import { publicProcedure, router } from '#/utils/trpc'
import { prisma } from '#/utils/prisma.server'

export const reportsRouter = router({
  getAll: publicProcedure.query(async () => {
    return await prisma.reports.findMany({
      orderBy: {
        id: 'asc',
      },
      include: {
        reportType: true,
        _count: {
          select: {
            comments: true,
          },
        },
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
      include: {
        reportType: true,
        images: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    })
  }),
  create: publicProcedure.input(
    z.object({
      payload: z.object({
        description: z.string(),
        email: z.string().optional(),
        reportTypeId: z.number(),
        lat: z.number(),
        lng: z.number(),
        photos: z.object({
          src: z.string(),
          height: z.number(),
          width: z.number(),
          blurDataUrl: z.string(),
          hexColor: z.string(),
        }).array().optional(),
      }),
    }),
  ).mutation(async ({ input }) => {
    const { payload } = input
    return await prisma.$transaction(async (tx) => {
      const report = await tx.reports.create({
        data: {
          details: payload.description,
          email: payload.email,
          lat: payload.lat,
          lng: payload.lng,
          reportTypeId: payload.reportTypeId,
          status: 'OPEN',
        },
      })

      if (payload.photos && payload.photos.length > 0) {
        await tx.images.createMany({
          data: payload.photos?.map(p => ({
            objectType: 'REPORT',
            objectId: report.id,
            ...p,
          })),
        })
      }

      return report
    })
  }),
})
