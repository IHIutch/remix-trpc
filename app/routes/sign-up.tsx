import * as React from 'react'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { Form, useActionData, useNavigation } from '@remix-run/react'
import { z } from 'zod'
import type {
  ActionFunctionArgs,
} from '@remix-run/node'
import {
  redirect,
} from '@remix-run/node'
import { Link } from 'react-aria-components'
import { nanoid } from 'nanoid'
import { createClient } from '#/utils/supabase/supabase.server'
import { getErrorMessage } from '#/utils/functions'
import { Button } from '#/components/ui/button'
import { TextField, TextFieldDescription, TextFieldErrorMessage } from '#/components/ui/text-field'
import { Label } from '#/components/ui/label'
import { Input } from '#/components/ui/input'
import { prisma } from '#/utils/prisma.server'

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().min(1),
  password: z.string().min(8),
})

export default function SignIn() {
  const response = useActionData<typeof action>()
  const navigation = useNavigation()

  const [form, fields] = useForm({
    // Sync the result of last submission
    lastResult: navigation.state === 'idle' ? response?.errors : null,
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
                <TextField isInvalid={!!fields.firstName.errors}>
                  <Label htmlFor={fields.firstName.id}>First Name</Label>
                  <Input {...getInputProps(fields.firstName, { type: 'text' })} />
                  {fields.firstName.errors
                    ? <TextFieldErrorMessage id={fields.firstName.descriptionId}>{fields.email.errors}</TextFieldErrorMessage>
                    : null}
                </TextField>
              </div>
              <div>
                <TextField isInvalid={!!fields.lastName.errors}>
                  <Label htmlFor={fields.lastName.id}>Last Name</Label>
                  <Input {...getInputProps(fields.lastName, { type: 'text' })} />
                  {fields.lastName.errors
                    ? <TextFieldErrorMessage id={fields.lastName.descriptionId}>{fields.email.errors}</TextFieldErrorMessage>
                    : null}
                </TextField>
              </div>
              <div>
                <TextField isInvalid={!!fields.email.errors}>
                  <Label htmlFor={fields.email.id}>Email</Label>
                  <Input {...getInputProps(fields.email, { type: 'email' })} />
                  {fields.email.errors
                    ? <TextFieldErrorMessage id={fields.email.descriptionId}>{fields.email.errors}</TextFieldErrorMessage>
                    : <TextFieldDescription id={fields.email.descriptionId}>For login and notification purposes only. We will never share your email.</TextFieldDescription>}
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
              {form.errors
                ? (
                    <div>
                      <p id={form.errorId}>{form.errors}</p>
                    </div>
                  )
                : null}
              <div className="flex items-center justify-between">
                <Link className="font-medium text-blue-700 underline" href="/log-in">Already have an account?</Link>
                <Button type="submit" className="bg-black text-white">
                  Sign Up
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
  const origin = request.headers.get('origin')

  const formData = await request.formData()
  const submission = parseWithZod(formData, { schema })

  if (submission.status !== 'success') {
    return {
      errors: submission.reply(),
    }
  }

  const { supabaseClient, headers } = createClient(request)
  const { data, error } = await supabaseClient.auth.signUp({
    email: submission.value.email,
    password: submission.value.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (!data.user) {
    return {
      errors: submission.reply({
        formErrors: [getErrorMessage(error)],
      }),
    }
  }

  await prisma.users.create({
    data: {
      id: data.user.id,
      firstName: submission.value.firstName,
      lastName: submission.value.lastName,
      publicId: nanoid(),
      type: 'USER',
    },
  })

  throw redirect('/profile', { headers })
}
