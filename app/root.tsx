import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  unstable_defineClientLoader,
  useLoaderData,
  useRouteError,
} from '@remix-run/react'
import './tailwind.css'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Navbar from './components/navbar'
import { trpc, trpcClient } from './utils/trpc-client'
import { env } from './env.server'

// export const loader = unstable_defineClientLoader(async () => {
//   console.log([env.VERCEL_URL, env.SUPABASE_URL])

//   return { test: [env.VERCEL_URL, env.SUPABASE_URL] }
// })

export async function loader() {
  console.log({
    VERCEL_URL: env.VERCEL_URL,
    VERCEL_PROJECT_PRODUCTION_URL: env.VERCEL_PROJECT_PRODUCTION_URL,
    SUPABASE_URL: env.SUPABASE_URL,
  })

  return json({
    ENV: {
      VERCEL_URL: env.VERCEL_URL,
      VERCEL_PROJECT_PRODUCTION_URL: env.VERCEL_PROJECT_PRODUCTION_URL,
      SUPABASE_URL: env.SUPABASE_URL,
    },
  })
}

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
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClientInit] = useState(() => trpcClient)

  const { ENV } = useLoaderData<typeof loader>()

  console.log({ ENV })

  return (
    <trpc.Provider client={trpcClientInit} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Outlet />
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
