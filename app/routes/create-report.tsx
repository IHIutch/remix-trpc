import { QueryClient } from '@tanstack/react-query'
import { createTRPCQueryUtils } from '@trpc/react-query'
import {
  unstable_defineLoader as defineLoader,
} from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import * as React from 'react'
import slugify from 'slugify'
import { trpcClient } from '#/utils/trpc-client'

const queryClient = new QueryClient()
const clientUtils = createTRPCQueryUtils({ queryClient, client: trpcClient })

export const loader = defineLoader(async () => {
  const reportTypes = await clientUtils.reportTypes.getAll.ensureData()
  const searchExamples = [...Array(2)].map(() => reportTypes[Math.floor(Math.random() * reportTypes.length)])

  return { reportTypes, searchExamples }
})

export default function CreateReport() {
  const { reportTypes, searchExamples } = useLoaderData<typeof loader>()
  const [search, setSearch] = React.useState('')

  const filteredReportTypes = reportTypes
    ? reportTypes.filter((o) => {
      return o.name.toLowerCase().includes(search.toLowerCase())
    })
    : []

  const groupedReportTypes = filteredReportTypes.reduce((acc, item) => {
    const key = item.group
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(item)
    return acc
  }, {} as Record<typeof reportTypes[number]['group'], typeof reportTypes>)

  //   const groupedReportTypes = groupBy(
  //     [...filteredReportTypes].sort((a, b) => (a.name > b.name ? 1 : -1)),
  //     o => o.group,
  //   )

  return (
    <div className="mx-auto h-full max-w-screen-sm p-4">
      <div className="flex h-full flex-col gap-4 rounded border bg-white p-4">
        <div>
          <label htmlFor="search" className="sr-only">Search</label>
          <input
            id="search"
            type="search"
            placeholder="Search..."
            autoComplete="off"
            className="w-full"
            onChange={e => setSearch(e.target.value)}
            aria-describedby="search-help"
          />
          <div id="search-help" className="mt-0.5">
            <span className="text-sm text-gray-700">
              Example:
              {' '}
              "
              {searchExamples[0].name}
              "
              {' '}
              or
              {' '}
              "
              {searchExamples[1].name}
              "
            </span>
          </div>
        </div>
        <div className="flex grow flex-col overflow-auto rounded border">
          {Object.keys(groupedReportTypes)
            .map(group => (
              <div key={group}>
                <div className="sticky top-0 flex h-6 items-center bg-slate-200 px-2 py-0.5">
                  <span
                    className="text-sm font-semibold uppercase tracking-wide"
                  >
                    {group}
                  </span>
                </div>
                {groupedReportTypes[group]
                  .map(item => (
                    <Link
                      key={item.id}
                      to={slugify(item.name, { lower: true, strict: true })}
                      className="block w-full px-4 py-2 hover:bg-slate-100"
                    >
                      {item.name}
                    </Link>
                  ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
