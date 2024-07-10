import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@remix-run/node'
import {
  unstable_defineAction as defineAction,
  unstable_defineLoader as defineLoader,
} from '@remix-run/node'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '#/utils/routers'
import { createContext } from '#/utils/trpc.server'

function handleRequest(args: LoaderFunctionArgs | ActionFunctionArgs) {
  return fetchRequestHandler({
    endpoint: '/trpc',
    req: args.request,
    router: appRouter,
    createContext,
  })
}

export const loader = defineLoader(args => handleRequest(args))

export const action = defineAction(args => handleRequest(args))
