import {
  unstable_defineLoader as defineLoader,
  json,
  redirect,
} from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { createClient } from '#/utils/supabase/supabase.server'
import { trpcClient } from '#/utils/trpc-client'

export const loader = defineLoader(async ({ request }) => {
  const { supabaseClient } = createClient(request)

  const isLogged = await supabaseClient.auth.getUser()

  if (!isLogged?.data?.user?.id) {
    return redirect('/sign-in')
  }

  const user = await trpcClient(request).auth.getAuthedUser.query()

  return json({
    user: {
      ...user,
      email: isLogged.data.user.email,
    },
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
