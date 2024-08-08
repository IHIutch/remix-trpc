import * as React from 'react'
import type { MetaFunction } from '@remix-run/node'
import {
  defer,
  unstable_defineAction as defineAction,
  unstable_defineLoader as defineLoader,
} from '@remix-run/node'
import { Await, Link, useFetcher, useFetchers, useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import { QueryClient } from '@tanstack/react-query'
import { createTRPCQueryUtils } from '@trpc/react-query'
import { z } from 'zod'
import { getFormProps, getTextareaProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { ClientOnly } from 'remix-utils/client-only'
import { trpcServerClient } from '#/utils/trpc-client.server'
import { createCaller } from '#/utils/caller-factory'
import { Icon } from '#/components/ui/icon'
import { Button, button } from '#/components/ui/button'
import { createContext } from '#/utils/trpc'
import Avatar from '#/components/ui/avatar'
import type { RouterOutput } from '#/utils/trpc/routers'
import { BlurImage } from '#/components/blur-image'
import ReportMap from '#/components/report-map.client'
import { formatDate } from '#/utils/functions/format-date'
import { cx } from '#/utils/cva.config'

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ]
}

const commentSchema = z.object({
  content: z.string().min(1),
})

const queryClient = new QueryClient()
const clientUtils = createTRPCQueryUtils({ queryClient, client: trpcServerClient() })

export const loader = defineLoader(async ({ request, params }) => {
  invariant(params.id, 'Missing report \'id\'')

  const caller = createCaller(await createContext(request))

  const comments = clientUtils.comments.getByReportId.ensureData({ objectId: Number(params.id) })
  const changelog = clientUtils.changelog.getByReportId.ensureData({ objectId: Number(params.id) })
  const report = await clientUtils.reports.getById.ensureData({ id: Number(params.id) })
  const user = await caller.auth.getAuthedUser()

  if (!report) {
    throw new Response('Not Found', { status: 404 })
  }
  return defer({
    report,
    user,
    changelog,
    comments,
    reportId: params.id,
  })
})

export default function Index() {
  const { report, comments, changelog } = useLoaderData<typeof loader>()

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-12">
      <div className="grid items-center gap-x-6 gap-y-12 lg:grid-cols-3">
        <div className="col-span-1 lg:col-span-2">
          <div className="flex items-center gap-4 border-b pb-8">
            <div>
              <div
                className="flex size-16 items-center justify-center rounded-md"
                style={{ backgroundColor: report.reportType.markerColor }}
              >
                <Icon size={10} name="warning-outline-rounded" className="text-white" />
              </div>
            </div>
            <div>
              <div>
                <span className="text-gray-600">
                  {`#${report?.id}  •  ${report?.reportType.group}`}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-medium">{ report?.reportType.name}</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1 h-full lg:col-start-3 lg:row-span-4 lg:row-start-1 lg:border-l lg:pl-6">
          <h2 className="mb-4 text-2xl font-medium">Status</h2>
          <div className="space-y-4">
            <div className={cx('flex gap-2', report.status === 'CREATED' ? 'text-green-700' : 'text-red-700')}>
              <Icon size={6} name={report.status === 'CREATED' ? 'lock-open-outline' : 'lock-outline'} />
              <p>
                <span>
                  {report.status === 'CREATED' ? 'Open' : 'Closed'}
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              <Icon size={6} name="forum-outline-rounded" />
              <p>
                <span>{report._count.comments}</span>
                {' '}
                <span>Comments</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Icon size={6} name="calendar-today" />
              <p>
                Opened on
                {' '}
                <time
                  dateTime={formatDate(report.createdAt, 'YYYY-MM-DD')}
                  title={formatDate(
                    report.createdAt,
                    'MMM D, YYYY h:mm A z',
                  )}
                >
                  {formatDate(report.createdAt, 'MMM D, YYYY')}
                </time>
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <h2 className="mb-4 text-2xl font-medium">Details</h2>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-8">
              <div>
                <h3 className="mb-2 text-xl font-medium">Photos</h3>
                {report?.images?.length > 0
                  ? (
                      <div className="grid grid-cols-2 gap-4">
                        {report.images.map(image => (
                          <BlurImage
                            key={image.id}
                            blurDataUrl={image.blurDataUrl || undefined}
                            className="aspect-[4/3] overflow-hidden rounded"
                            img={(
                              <img
                                key={image.id}
                                src={image.src}
                                className="size-full object-cover"
                              />
                            )}
                          />
                        ))}
                      </div>
                    )
                  : (
                      <div>
                        <p className="text-lg italic text-gray-500">No photos provided</p>
                      </div>
                    )}
              </div>
              <div>
                <h3 className="mb-3 text-xl font-medium">Description</h3>
                <div>
                  {report?.details
                    ? (
                        <p className="text-lg text-gray-600">
                          {report.details}
                        </p>
                      )
                    : (
                        <p className="text-lg italic text-gray-500">
                          No description provided
                        </p>
                      )}
                </div>
              </div>
            </div>
            <div>
              <div>
                <h3 className="mb-3 text-xl font-medium">Location</h3>
                <div className="space-y-8">
                  {report?.lng && report?.lat
                    ? (
                        <div>
                          <h4 className="">
                            Coordinates
                          </h4>
                          <p className="mb-2 text-sm text-gray-600">
                            {`${report.lat.toFixed(3)}, ${report.lng.toFixed(3)}`}
                          </p>
                          <div className="aspect-video overflow-hidden rounded-md bg-slate-400">
                            <ClientOnly>
                              {() => (
                                <ReportMap marker={{
                                  markerColor: report.reportType.markerColor,
                                  lat: report.lat,
                                  lng: report.lng,
                                }}
                                />
                              )}
                            </ClientOnly>
                          </div>
                        </div>
                      )
                    : null}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <div>
            <h2 className="mb-4 text-2xl font-medium">
              Activity
            </h2>
            <div>
              <React.Suspense fallback={null}>
                <Await resolve={Promise.all([comments, changelog])}>
                  {([comments, changelog]) => <ActivityList comments={comments} changelog={changelog} />}
                </Await>
              </React.Suspense>
            </div>
            <div className="border-t-2 pt-6">
              <CommentBox />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ActivityList({ changelog, comments }: {
  changelog: RouterOutput['changelog']['getByReportId']
  comments: RouterOutput['comments']['getByReportId']
}) {
  const { user, reportId } = useLoaderData<typeof loader>()

  const mergeActivities = ({ changelog, comments }: {
    changelog: RouterOutput['changelog']['getByReportId']
    comments: RouterOutput['comments']['getByReportId']
  }) => {
    return [
      ...comments.map(c => ({ actType: 'comment' as const, ...c })),
      ...changelog.map(c => ({ actType: 'changelog' as const, ...c })),
    ].sort((a, b) => new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf())
  }

  const fetchers = useFetchers()
  const optimisticComments = fetchers.reduce<RouterOutput['comments']['getByReportId']>((acc, f) => {
    if (f.formData) {
      invariant(user, '\'user\' should never be falsy here')
      const data = commentSchema.parse(Object.fromEntries(f.formData))
      acc.push({
        ...data,
        id: -1,
        replyTo: null,
        objectType: 'REPORT',
        objectId: Number(reportId),
        createdAt: new Date(),
        updatedAt: new Date(),
        creatorId: user.publicId,
        deletedAt: null,
        users: user,
      })
    }
    return acc
  }, [])

  const activities = mergeActivities({ changelog, comments: [...comments, ...optimisticComments] })

  return activities?.length
    ? (
        <div className="relative ml-6 border-l-2">
          {activities.map(c => (
            <div key={c.id} className="relative left-[-25px] pb-8">
              {c.actType === 'comment'
                ? (
                    <div className="flex gap-4">
                      <Avatar className="outline outline-8 outline-slate-50" name={`${c.users.firstName} ${c.users.lastName}`} />
                      <div>
                        <div className="mb-2">
                          <p className="font-medium leading-tight">
                            {c.users.firstName}
                            {' '}
                            {c.users.lastName}
                          </p>
                          <time className="text-sm text-gray-500">{ c.createdAt.toDateString()}</time>
                        </div>
                        <p>{c.content}</p>
                      </div>
                    </div>
                  )
                : null}

              {c.actType === 'changelog'
                ? (
                    <div className="flex items-center gap-4">
                      <div className="flex w-12 justify-center">
                        <div className="relative size-8 rounded-full bg-gray-700 outline outline-8 outline-slate-50"></div>
                      </div>
                      <div>
                        <span>
                          <span className="font-medium">Status</span>
                          {' '}
                          changed to
                          {' '}
                          <span className="font-medium">{c.newValue?.toString()}</span>
                        </span>
                        <time className="ml-2 text-sm text-gray-500">{ c.createdAt.toDateString()}</time>
                      </div>
                    </div>
                  )
                : null}

            </div>
          ))}
        </div>
      )
    : null
}

function CommentBox() {
  const { user } = useLoaderData<typeof loader>()
  const commentFetcher = useFetcher<typeof action>()

  const formRef = React.useRef<HTMLFormElement>(null)
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  const [offsetPos, setOffetPos] = React.useState(0)

  const [form, fields] = useForm({
    id: 'create-comment',
    // Sync the result of last submission
    // lastResult: commentFetcher.state === 'idle' ? commentFetcher.data : null,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: commentSchema })
    },
  })

  const handleSetOffsetHeight = () => {
    setOffetPos(window.innerHeight - (inputRef.current?.getBoundingClientRect().top || 0))
  }

  const handleRestoreOffset = React.useCallback(() => {
    const top = inputRef.current?.getBoundingClientRect().top || 0
    const scrollTop = window.scrollY
    const viewportHeight = window.innerHeight
    const targetScrollPosition = scrollTop + top - (viewportHeight - offsetPos)

    window.scrollTo({
      top: targetScrollPosition,
    })
  }, [offsetPos])

  React.useEffect(() => {
    if (commentFetcher.state === 'submitting') {
      if (inputRef?.current?.value) {
        inputRef.current.value = ''
      }
      handleRestoreOffset()
      inputRef.current?.focus()
    }
  }, [commentFetcher.state, handleRestoreOffset])

  return (
    user
      ? (
          <div className="flex gap-4">
            <Avatar name={`${user.firstName} ${user.lastName}`} />
            <commentFetcher.Form
              ref={formRef}
              {...getFormProps(form)}
              method="post"
              className="flex grow"
            >
              <div className="flex w-full flex-col">
                <div className="mb-2">
                  <label className="mb-2 block" htmlFor={fields.content.id}>Write a content</label>
                  <textarea
                    ref={inputRef}
                    {...getTextareaProps(fields.content)}
                    className="h-24 w-full rounded border border-slate-300 bg-white"
                    required
                  />
                </div>
                {fields.content.errors ? <p>{fields.content.errors}</p> : null}
                <div className="ml-auto">
                  <Button type="submit" onPress={handleSetOffsetHeight}>
                    Submit Comment
                  </Button>
                </div>
              </div>
              <div>
              </div>
            </commentFetcher.Form>
          </div>
        )
      : (
          <div className="flex items-center rounded-md border bg-slate-200 p-4">
            <p>
              <Link to="/sign-up" className={button({ className: 'bg-blue-600 text-white' })}>Sign Up</Link>
              {' '}
              or
              {' '}
              <Link to="/log-in" className="font-medium text-blue-600 underline">log in to comment</Link>
              . Join the conversation
            </p>
          </div>
        )
  )
}

export const action = defineAction(async ({ params, request }) => {
  invariant(params.id, 'Missing report \'id\'')
  const formData = await request.formData()
  const submission = parseWithZod(formData, { schema: commentSchema })

  if (submission.status !== 'success') {
    return {
      result: submission.reply(),
      status: submission.status,
    }
  }

  const caller = createCaller(await createContext(request))
  caller.comments.create({
    payload: {
      ...submission.value,
      objectId: Number(params.id),
      objectType: 'REPORT',
    },
  })

  // clientUtils.comments.getByReportId.setData({ objectId: Number(params.id) }, (prev) => {
  //   return prev ? [...prev, data] : undefined
  // })

  clientUtils.comments.getByReportId.invalidate({ objectId: Number(params.id) }, { refetchType: 'all' })

  return {
    result: submission.reply(),
    status: submission.status,
  }
})
