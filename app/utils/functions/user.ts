import { useRouteLoaderData } from '@remix-run/react'
import type { loader as rootLoader } from '#/root'

export function useOptionalUser() {
  const data = useRouteLoaderData<typeof rootLoader>('root')
  if (!data) {
    return undefined
  }
  return data.user
}

export function useUser() {
  const maybeUser = useOptionalUser()
  if (!maybeUser) {
    throw new Error(
      'No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.',
    )
  }
  return maybeUser
}
