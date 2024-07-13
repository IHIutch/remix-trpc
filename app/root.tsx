import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import './tailwind.css'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Navbar from './components/navbar'
import { trpc, trpcClientInit } from './utils/trpc-client-client'

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
  const [trpcClient] = useState(() => trpcClientInit)

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Outlet />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </trpc.Provider>
  )
}
