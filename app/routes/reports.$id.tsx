import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import {
  unstable_defineLoader as defineLoader,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { QueryClient } from '@tanstack/react-query'
import { createTRPCQueryUtils } from '@trpc/react-query'
import { trpc, trpcClientInit } from '#/utils/trpc-client-client'
// import { trpcClient } from '#/utils/trpc-client'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

const queryClient = new QueryClient()
const clientUtils = createTRPCQueryUtils({ queryClient, client: trpcClientInit })

export const loader = defineLoader(async ({ params }: LoaderFunctionArgs) => {
  invariant(params.id, 'Missing report \'id\'')
  // const report = await trpcClient(request).reports.getById.query({
  //   id: Number(params.id),
  // })
  const report = await clientUtils.reports.getById.ensureData({ id: Number(params.id) })

  return { report, id: params.id }
})

export default function Index() {
  const { report: initialData, id } = useLoaderData<typeof loader>()
  const { data: report } = trpc.reports.getById.useQuery({ id: Number(id) }, {
    initialData,
    refetchOnMount: !initialData,
  })

  return (
    <div className="p-4 font-sans">
      <h1 className="text-3xl">Welcome to Remix</h1>
      <pre>{JSON.stringify(report, null, 2)}</pre>
    </div>
  )
}
