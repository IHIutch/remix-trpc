import * as React from 'react'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
  useRouteError,
} from '@remix-run/react'
import './tailwind.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { unstable_defineLoader as definLoader } from '@remix-run/node'
import { RouterProvider } from 'react-aria-components'
import Navbar from './components/navbar'
import { trpc, trpcClient } from './utils/trpc-client'
import { createCaller } from './utils/trpc-client.server'
import { createContext } from './utils/trpc'

export const loader = definLoader(async ({ request }) => {
  const caller = createCaller(await createContext(request))
  const user = await caller.auth.getAuthedUser()

  return {
    user,
  }
})

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full pt-16">
        <Navbar />
        <div className="h-full">
          {children}
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  const [queryClient] = React.useState(() => new QueryClient())
  const [trpcClientInit] = React.useState(() => trpcClient)
  const navigate = useNavigate()

  return (
    <trpc.Provider client={trpcClientInit} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider navigate={navigate}>
          <Outlet />
        </RouterProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </trpc.Provider>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  console.error(error)
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        {/* add the UI you want your users to see */}
        <Scripts />
      </body>
    </html>
  )
}
