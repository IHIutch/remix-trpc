import {
  unstable_defineLoader as defineLoader,
  json,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { createCaller } from '#/utils/caller-factory'
import { createContext_v2 } from '#/utils/trpc'

export const loader = defineLoader(async ({ request }) => {
  // const { supabaseClient } = createClient(request)

  // const isLogged = await supabaseClient.auth.getUser()

  // if (!isLogged?.data?.user?.id) {
  //   return redirect('/sign-in')
  // }

  // const user = await trpcClient(request).auth.getAuthedUser.query()

  const caller = createCaller(await createContext_v2(request))
  const user = await caller.auth.getAuthedUser()

  return json({
    user,
  })
})

export default function Protected() {
  const { user } = useLoaderData<typeof loader>()

  return (
    <div>
      <pre>{JSON.stringify({ user }, null, 2)}</pre>
    </div>
  )
}
