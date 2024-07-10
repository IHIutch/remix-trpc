import type { MetaFunction } from '@remix-run/node'
import {
  unstable_defineLoader as defineLoader,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { trpcClient } from '#/utils/trpc-client'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export const loader = defineLoader(async (args) => {
  const reports = await trpcClient(args.request).reports.getAll.query()
  return { reports }
})

export default function Index() {
  const { reports } = useLoaderData<typeof loader>()

  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Welcome to Remix</h1>
      <pre>{JSON.stringify(reports, null, 2)}</pre>
    </div>
  )
}
