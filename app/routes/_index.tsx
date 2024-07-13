import type { MetaFunction } from '@remix-run/node'
import {
  unstable_defineLoader as defineLoader,
} from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import dayjs from 'dayjs'
import { trpcClient } from '#/utils/trpc-client'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export const loader = defineLoader(async ({ request }) => {
  const reports = await trpcClient(request).reports.getAll.query()
  return { reports }
})

export default function Index() {
  const { reports } = useLoaderData<typeof loader>()

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
