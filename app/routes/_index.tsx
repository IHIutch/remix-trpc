import type { MetaFunction } from '@remix-run/node'
import {
  unstable_defineLoader as defineLoader,
} from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import dayjs from 'dayjs'
import { createTRPCQueryUtils } from '@trpc/react-query'
import { QueryClient } from '@tanstack/react-query'
import { trpc, trpcClientInit } from '#/utils/trpc-client-client'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
  ]
}

const queryClient = new QueryClient()
const clientUtils = createTRPCQueryUtils({ queryClient, client: trpcClientInit })

export const loader = defineLoader(async () => {
  // const caller = createCaller({})
  const reports = await clientUtils.reports.getAll.ensureData()
  return { reports }
})

export default function Index() {
  const { reports: initialData } = useLoaderData<typeof loader>()
  const { data: reports } = trpc.reports.getAll.useQuery(undefined, {
    initialData,
    refetchOnMount: !initialData,
  })

  return (
    <div className="flex h-full flex-col">
      <div className="flex border-b px-4 py-2">
        <div className="ml-auto">
          <button type="button" className="h-8 rounded-md border px-2 text-sm font-medium">Filters</button>
        </div>
      </div>
      <div className="grid grow grid-cols-2 overflow-hidden">
        <div className="h-full bg-slate-300"></div>
        <div className="h-full divide-y overflow-auto p-4">
          {reports
            ? reports.map(report => (
              <div key={report.id} className="relative border-x bg-white p-3 first:rounded-t-md first:border-t last:rounded-b-md last:border-b hover:bg-slate-100">
                <div>
                  <Link to={`reports/${report.id}`} className="font-medium after:absolute after:inset-0">
                    {report.reportTypes.group}
                    {' '}
                    -
                    {' '}
                    {report.reportTypes.name}
                  </Link>
                </div>
                <div>
                  <span className="text-sm text-gray-500">
                    #
                    {report.id}
                    {' '}
                    • Opened on
                    { ' '}
                    {dayjs(report.createdAt).format('MM/DD/YYYY')}
                  </span>
                </div>
              </div>
            ))
            : null}
        </div>
      </div>
    </div>
  )
}
