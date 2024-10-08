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
import * as ReactAria from 'react-aria-components'
import { trpcServerClient } from '#/utils/trpc-client.server'
import { createClient as createServerClient } from '#/utils/supabase/supabase.server'
import { getErrorMessage, resizeImage } from '#/utils/functions'
import { createContext } from '#/utils/trpc'
import { createCaller } from '#/utils/caller-factory'
import { createClient } from '#/utils/supabase/supabase.client'
import { env } from '#/env.server'
import { Icon } from '#/components/ui/icon'
import { getImageData } from '#/utils/functions/get-image-data.server'
import { Button } from '#/components/ui/button'
import { TextField, TextFieldErrorMessage } from '#/components/ui/text-field'
import { Label } from '#/components/ui/label'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { useIsPending } from '#/utils/functions/use-pending'

const queryClient = new QueryClient()
const clientUtils = createTRPCQueryUtils({ queryClient, client: trpcServerClient() })

const schema = z.object({
  // location: z.object({
  //   lng: z.number().min(1),
  //   lat: z.number().min(1),
  // }),
  photos: z.array(z.string()).optional(),
  description: z.string().min(1),
  email: z.string().email().optional(),
})

interface PendingImage {
  preview: string
  name: string
}

interface UploadedImage {
  src: string
  name: string
}

export const loader = defineLoader(async ({ params }) => {
  invariant(params['report-type'], 'Missing \'report-type\'')

  const reportTypes = await clientUtils.reportTypes.getAll.ensureData()
  const reportType = reportTypes.find(rt => slugify(rt.name, { lower: true, strict: true }) === params['report-type'])

  if (!reportType) {
    throw redirect('/create-report')
  }

  return {
    reportType,
    ENV: {
      SUPABASE_URL: env.SUPABASE_URL,
      SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY,
    },
  }
})

export default function CreateReport() {
  const { reportType, ENV } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const isSubmitting = useIsPending()

  const inputRef = React.useRef<HTMLInputElement>(null)

  const [pendingPhotos, setPendingPhotos] = React.useState<PendingImage[]>([])
  const [uploadedPhotos, setUploadedPhotos] = React.useState<UploadedImage[]>([])

  const [form, fields] = useForm({
    // Sync the result of last submission
    lastResult: navigation.state === 'idle' ? actionData?.errors : null,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema })
    },

  })

  const uploadFile = async (file: File) => {
    const supabaseClient = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY)

    const fileExt = file.name.split('.').pop()
    const filePath = `${nanoid()}.${fileExt}`
    const { data, error } = await supabaseClient.storage
      .from('buffalo311')
      .upload(filePath, file)

    if (error) {
      throw new Error(getErrorMessage(error))
    }

    const url = supabaseClient.storage.from('buffalo311').getPublicUrl(data.path).data.publicUrl
    return url
  }

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (!e.target.files) {
      return
    }
    const maxImages = 4
    const maxSizeMB = 5 * 1024 * 1024 // 5MB

    const files = Array.from(e.target.files)
    const validFiles = files.filter(file => file.size <= maxSizeMB)
    const nonDuplicateFiles = validFiles.filter(file => !uploadedPhotos.some(image => image.name === file.name))

    const newFiles = nonDuplicateFiles.slice(0, maxImages - uploadedPhotos.length)
    if (newFiles.length === 0) {
      return
    }

    const imagePreviews = newFiles.map(file => ({
      preview: URL.createObjectURL(file),
      name: file.name,
    }))

    setPendingPhotos(prev => [...prev, ...imagePreviews])

    newFiles.forEach(async (file) => {
      try {
        const resized = await resizeImage(file)
        const uploadedImageUrl = await uploadFile(resized)
        setUploadedPhotos(prev => [
          ...prev,
          {
            src: uploadedImageUrl,
            name: file.name,
          },
        ])
      }
      catch (error) {
        setPendingPhotos(prev => prev.filter((image) => {
          const existing = imagePreviews.find(i => i.name === image.name)
          return !!existing
        }))
        console.error('Error uploading image:', error)
      }
    })
  }

  const handleRemoveImage = (name: string) => {
    setPendingPhotos(prev => prev.filter(image => image.name !== name))
    setUploadedPhotos(prev => prev.filter(image => image.name !== name))
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
              {pendingPhotos?.length > 0
                ? pendingPhotos.map((photo) => {
                  const found = uploadedPhotos.find(
                    u => u.name === photo.name,
                  )
                  return (
                    <div key={photo.name} className="relative aspect-square w-full overflow-hidden">
                      <ReactAria.Button onPress={() => handleRemoveImage(photo.name)} className="absolute right-2 top-2 z-10 flex size-8 items-center justify-center rounded-full bg-black/70">
                        <Icon className="text-white" name="close-small-outline-rounded" />
                      </ReactAria.Button>
                      <div className="absolute inset-0 size-full">
                        {!found
                          ? (
                              <div className="absolute inset-0 flex size-full items-center justify-center bg-white/70 text-blue-700">
                                <span className="icon-[material-symbols--progress-activity] size-8 animate-spin"></span>
                              </div>
                            )
                          : null}
                        <FadeInImage
                          className="aspect-square size-full rounded-md border border-slate-300 object-cover"
                          src={found?.src || photo.preview}
                          placeholderSrc={photo.preview}
                        />
                      </div>
                    </div>
                  )
                })
                : null}
              {pendingPhotos?.length < 4
                ? (
                    <label htmlFor="photo-input" className="flex aspect-square w-full cursor-pointer items-center justify-center rounded bg-slate-100 font-medium hover:bg-slate-200">
                      Add
                    </label>
                  )
                : null}
            </div>
            <input
              id="photo-input"
              type="file"
              multiple
              accept="image/*"
              className="sr-only"
              ref={inputRef}
              onChange={onFileChange}
            />
            {uploadedPhotos.length > 0
              ? uploadedPhotos.map(p => (
                <input key={p.src} name={fields.photos.name} value={p.src} readOnly hidden />
              ))
              : null}
          </div>
          <div>
            <TextField isInvalid={!!fields.description.errors}>
              <Label htmlFor={fields.description.id}>Description/Details</Label>
              <Textarea {...getTextareaProps(fields.description)} />
              {fields.description.errors ? <TextFieldErrorMessage id={fields.description.descriptionId}>{fields.description.errors}</TextFieldErrorMessage> : null}
            </TextField>
          </div>
          <div>
            <TextField isInvalid={!!fields.email.errors}>
              <Label htmlFor={fields.email.id}>Email</Label>
              <Input {...getInputProps(fields.email, { type: 'email' })} />
              {fields.email.errors ? <TextFieldErrorMessage id={fields.email.descriptionId}>{fields.email.errors}</TextFieldErrorMessage> : null}
            </TextField>
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
          <Button
            isDisabled={pendingPhotos.length > 0 && pendingPhotos.length !== uploadedPhotos.length}
            isLoading={isSubmitting}
            type="submit"
            className="w-full bg-blue-600 text-white aria-disabled:bg-blue-400"
          >
            Submit
          </Button>
        </div>
      </Form>
    </div>
  )
}

function FadeInImage({ src, placeholderSrc, onLoad, ...props }: {
  src: UploadedImage['src']
  placeholderSrc?: PendingImage['preview']
  onLoad?: () => void
  className?: string
}) {
  const [imgSrc, setImgSrc] = React.useState(placeholderSrc || src)
  const onLoadRef = React.useRef(onLoad)
  React.useEffect(() => {
    onLoadRef.current = onLoad
  }, [onLoad])

  React.useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setImgSrc(src)
      if (onLoadRef.current) {
        onLoadRef.current()
      }
    }
    img.src = src
  }, [src])

  return (
    <img
      src={imgSrc}
      alt=""
      {...props}
    />
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
  const { headers } = createServerClient(request)

  let photos: {
    src: string
    height: number
    width: number
    hexColor: string
    blurDataUrl: string
  }[] = []
  if (submission.value.photos) {
    photos = await Promise.all(submission.value.photos?.map(async (p) => {
      const imgData = await getImageData(p)
      return {
        src: p,
        height: imgData.height,
        width: imgData.width,
        hexColor: imgData.hex,
        blurDataUrl: imgData.blurDataUrl,
      }
    }))
  }

  const caller = createCaller(await createContext(request))
  const report = await caller.reports.create({
    payload: {
      description: submission.value.description,
      email: submission.value.email,
      reportTypeId: reportType?.id,
      lat: 123,
      lng: 123,
      photos,
    },
  })

  throw redirect(`/reports/${report.id}`, { headers })
})
