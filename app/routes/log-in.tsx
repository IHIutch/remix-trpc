import * as React from 'react'
import { Form, useActionData, useNavigation } from '@remix-run/react'
import { z } from 'zod'
import type {
  ActionFunctionArgs,
} from '@remix-run/node'
import {
  redirect,
} from '@remix-run/node'
import { parseWithZod } from '@conform-to/zod'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { Link } from 'react-aria-components'
import { createClient } from '#/utils/supabase/supabase.server'
import { getErrorMessage } from '#/utils/functions'
import { Button } from '#/components/ui/button'
import { TextField, TextFieldDescription, TextFieldErrorMessage } from '#/components/ui/text-field'
import { Label } from '#/components/ui/label'
import { Input } from '#/components/ui/input'
import { useIsPending } from '#/utils/functions/use-pending'

const schema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
})

export default function SignIn() {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const isSubmitting = useIsPending()

  const [form, fields] = useForm({
    // Sync the result of last submission
    lastResult: navigation.state === 'idle' ? actionData?.errors : null,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema })
    },

  })

  const [isShowingPassword, setIsShowingPassword] = React.useState(false)

  return (
    <div className="mx-auto w-full max-w-screen-lg">
      <div className="grid grid-cols-4">
        <div className="col-span-2 col-start-2">
          <div className="mt-12 rounded border bg-white p-8">
            <Form
              className="space-y-6"
              method="post"
              {...getFormProps(form)}
            >
              <div>
                <TextField isInvalid={!!fields.email.errors}>
                  <Label htmlFor={fields.email.id}>Email</Label>
                  <Input {...getInputProps(fields.email, { type: 'email' })} />
                  {fields.email.errors
                    ? <TextFieldErrorMessage id={fields.email.descriptionId}>{fields.email.errors}</TextFieldErrorMessage>
                    : null}
                </TextField>
              </div>
              <div>
                <TextField isInvalid={!!fields.password.errors}>
                  <Label htmlFor={fields.password.id}>Password</Label>
                  <div className="relative">
                    <Input {...getInputProps(fields.password, { type: isShowingPassword ? 'text' : 'password' })} className="pr-20" />
                    <div className="absolute inset-y-0 right-0 flex w-16 items-center justify-center">
                      <Button className="w-14 px-0" size="sm" onPress={() => setIsShowingPassword(!isShowingPassword)}>{isShowingPassword ? 'Hide' : 'Show'}</Button>
                    </div>
                  </div>
                  {fields.password.errors
                    ? <TextFieldErrorMessage id={fields.password.descriptionId}>{fields.password.errors}</TextFieldErrorMessage>
                    : <TextFieldDescription id={fields.password.descriptionId}>Please create a password with 8 or more characters.</TextFieldDescription>}
                </TextField>
              </div>
              <div className="flex items-center justify-between">
                <Link className="font-medium text-blue-700 underline" href="/forgot">Forgot Password?</Link>
                <Button type="submit" isLoading={isSubmitting} className="relative">
                  Log In
                </Button>
              </div>
              {form.errors
                ? (
                    <div>
                      <p className="text-sm text-red-600 dark:text-red-400" id={form.errorId}>{form.errors}</p>
                    </div>
                  )
                : null}
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function action({
  request,
}: ActionFunctionArgs) {
  const formData = await request.formData()
  const submission = parseWithZod(formData, { schema })

  if (submission.status !== 'success') {
    return {
      errors: submission.reply(),
    }
  }

  const { supabaseClient, headers } = createClient(request)
  const { error } = await supabaseClient.auth.signInWithPassword({
    email: submission.value.email,
    password: submission.value.password,
  })

  if (error) {
    return {
      errors: submission.reply({
        formErrors: [getErrorMessage(error)],
      }),
    }
  }

  throw redirect('/profile', { headers })
}
