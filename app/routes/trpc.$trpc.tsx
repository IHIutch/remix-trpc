import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@remix-run/node'
import {
  unstable_defineAction as defineAction,
  unstable_defineLoader as defineLoader,
} from '@remix-run/node'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { createContext } from '#/utils/trpc'
import { appRouter } from '#/utils/trpc/routers'

function handleRequest(args: LoaderFunctionArgs | ActionFunctionArgs) {
  return fetchRequestHandler({
    endpoint: '/trpc',
    req: args.request,
    router: appRouter,
    createContext: async ctx => await createContext(ctx.req),
  })
}

export const loader = defineLoader(args => handleRequest(args))

export const action = defineAction(args => handleRequest(args))
