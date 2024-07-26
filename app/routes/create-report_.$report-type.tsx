import path from 'node:path'
import * as React from 'react'
import { QueryClient } from '@tanstack/react-query'
import { createTRPCQueryUtils } from '@trpc/react-query'
import {
  unstable_defineAction as defineAction,
  unstable_defineLoader as defineLoader,
  redirect,
} from '@remix-run/node'
import { Form, useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import slugify from 'slugify'
import invariant from 'tiny-invariant'
import { getFormProps, getInputProps, getTextareaProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { Button } from '#/components/ui/button'
import { trpcClient } from '#/utils/trpc-client'
import { createClient } from '#/utils/supabase/supabase.server'
import { getErrorMessage } from '#/utils/functions'
import { createContext } from '#/utils/trpc'
import { createCaller } from '#/utils/caller-factory'

const queryClient = new QueryClient()
const clientUtils = createTRPCQueryUtils({ queryClient, client: trpcClient })

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const schema = z.object({
  // location: z.object({
  //   lng: z.number().min(1),
  //   lat: z.number().min(1),
  // }),
  photos: z.array(z.instanceof(File)
    .refine(file => file.size < MAX_FILE_SIZE),
  ).refine(
    files => files.every(file => file.size < MAX_FILE_SIZE),
    'Photo size must be less than 5MB',
  ),
  description: z.string().min(1),
  email: z.string().email().optional(),
})

export const loader = defineLoader(async ({ params }) => {
  invariant(params['report-type'], 'Missing \'report-type\'')

  const reportTypes = await clientUtils.reportTypes.getAll.ensureData()
  const reportType = reportTypes.find(rt => slugify(rt.name, { lower: true, strict: true }) === params['report-type'])

  if (!reportType) {
    throw redirect('/create-report')
  }

  return { reportType }
})

export default function CreateReport() {
  const { reportType } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()

  const inputRef = React.useRef<HTMLInputElement>(null)

  const [previewPhotos, setPreviewPhotos] = React.useState<File[]>([])

  const [form, fields] = useForm({
    // Sync the result of last submission
    lastResult: navigation.state === 'idle' ? actionData?.errors : null,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema })
    },

  })

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (!e.target.files) {
      return
    }
    const files = [...previewPhotos, ...e.target.files]
      .filter((file) => {
        return file.size < MAX_FILE_SIZE // 5MB
      })
      .slice(0, 4)

    setPreviewPhotos(files)

    const dt = new DataTransfer()
    files.forEach(t => dt.items.add(t))
    if (inputRef.current) {
      inputRef.current.files = dt.files
    }
  }

  const handleRemovePhoto = (idx: number) => {
    const files = [...previewPhotos]
    files.splice(idx, 1)
    setPreviewPhotos(files)

    const dt = new DataTransfer()
    files.forEach(t => dt.items.add(t))

    if (inputRef.current) {
      inputRef.current.files = dt.files
    }
  }

  return (
    <div className="mx-auto max-w-screen-sm p-4">
      <Form
        method="post"
        {...getFormProps(form)}
        encType="multipart/form-data"
        className="flex flex-col divide-y rounded border bg-white"
      >
        <div className="p-4">
          <div>
            <span className="text-gray-700">{reportType.group}</span>
          </div>
          <h1 className="text-lg font-semibold">
            {reportType.name}
          </h1>
        </div>
        <div className="space-y-4 p-4">
          <div></div>
          <div>
            <div className="grid grid-cols-3 gap-2">
              {previewPhotos?.length > 0
                ? previewPhotos.map((photo, idx) => (
                  <div key={photo.name} className="relative aspect-square w-full overflow-hidden rounded">
                    <Button type="button" onClick={() => handleRemovePhoto(idx)} className="absolute right-4 top-4">{idx}</Button>
                    <img key={photo.name} src={URL.createObjectURL(photo)} alt="" className="size-full object-cover" />
                  </div>
                ))
                : null}
              {previewPhotos?.length < 4
                ? (
                    <label htmlFor={fields.photos.id} className="flex aspect-square w-full cursor-pointer items-center justify-center rounded bg-slate-100 font-medium hover:bg-slate-200">
                      Add
                    </label>
                  )
                : null}
            </div>
            <input
              {...getInputProps(fields.photos, { type: 'file' })}
              multiple
              accept="image/*"
              className="sr-only"
              ref={inputRef}
              onChange={onFileChange}
            />
            {fields.photos.errors ? <p id={fields.photos.descriptionId}>{fields.photos.errors}</p> : null}
          </div>
          <div>
            <label className="block" htmlFor={fields.description.id}>Description/Details</label>
            <textarea {...getTextareaProps(fields.description)} required />
            {fields.description.errors ? <p id={fields.description.descriptionId}>{fields.description.errors}</p> : null}
          </div>
          <div>
            <label className="block" htmlFor={fields.email.id}>Email</label>
            <input {...getInputProps(fields.email, { type: 'email' })} />
            {fields.email.errors ? <p id={fields.email.descriptionId}>{fields.email.errors}</p> : null}
          </div>

          {form.errors
            ? (
                <div>
                  <p id={form.errorId}>{form.errors}</p>
                </div>
              )
            : null}

        </div>
        <div className="p-4">
          <Button type="submit" className="w-full bg-blue-600 text-white">Submit</Button>
        </div>
      </Form>
    </div>
  )
}

export const action = defineAction(async ({ request, params }) => {
  invariant(params['report-type'], 'Missing \'report-type\'')

  const reportTypes = await clientUtils.reportTypes.getAll.ensureData()
  const reportType = reportTypes.find(rt => slugify(rt.name, { lower: true, strict: true }) === params['report-type'])

  invariant(reportType?.id, 'reportType.id not found')

  const formData = await request.formData()
  const submission = parseWithZod(formData, { schema })

  if (submission.status !== 'success') {
    return {
      result: submission.reply(),
      status: submission.status,
    }
  }
  const { supabaseClient, headers } = createClient(request)

  const uploaded = await Promise.all(
    submission.value.photos.map(async (photo) => {
      const fileExt = path.extname(photo.name)
      const filePath = nanoid() + fileExt
      const { data, error } = await supabaseClient.storage
        .from('buffalo311')
        .upload(filePath, photo)

      if (error) {
        return { success: false, data, error: getErrorMessage(error) }
      }

      return { success: true, data, error: getErrorMessage(error) }
    }),
  )

  const photoSchema = z.object({
    data: z.object({
      id: z.string(),
      path: z.string(),
      fullPath: z.string(),
    }),
  }).array()

  const parsedPhotos = photoSchema.safeParse(uploaded)
  if (!parsedPhotos.success) {
    const uploadError = uploaded.find(u => u.error)?.error
    return {
      result: submission.reply({
        formErrors: [getErrorMessage(uploadError)],
      }),
      status: 'error',
    }
  }

  const caller = createCaller(await createContext(request))
  const report = await caller.reports.create({
    payload: {
      description: submission.value.description,
      email: submission.value.email,
      reportTypeId: reportType?.id,
      lat: 123,
      lng: 123,
      photos: parsedPhotos.data.map(u => ({ url: u.data.path })),
    },
  })

  return redirect(`/reports/${report.id}`, { headers })
})
