import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import {
  unstable_defineLoader as defineLoader,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { trpcClient } from '#/utils/trpc-client'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

export const loader = defineLoader(async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.id, 'Missing report \'id\'')
  const report = await trpcClient(request).reports.getById.query({
    where: {
      id: Number(params.id),
    },
  })
  return { report }
})

export default function Index() {
  const { report } = useLoaderData<typeof loader>()

  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Welcome to Remix</h1>
      <pre>{JSON.stringify(report, null, 2)}</pre>
    </div>
  )
}
