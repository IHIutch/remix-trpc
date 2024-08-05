import {
  unstable_defineAction as defineAction,
  unstable_defineLoader as defineLoader,
  redirect,
} from '@remix-run/node'
import { createClient } from '#/utils/supabase/supabase.server'
import { getErrorMessage } from '#/utils/functions'

export const loader = defineLoader(async ({ request }) => {
  const { supabaseClient } = createClient(request)
  const { error } = await supabaseClient.auth.signOut()

  if (error) {
    throw new Error(getErrorMessage(error))
  }
  throw redirect('/')
})

export const action = defineAction(async ({ request }) => {
  const { supabaseClient } = createClient(request)

  const { error } = await supabaseClient.auth.signOut()

  if (error) {
    throw new Error(getErrorMessage(error))
  }
  throw redirect('/')
})
