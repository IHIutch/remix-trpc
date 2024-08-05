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
import { createClient } from '#/utils/supabase/supabase.server'
import { getErrorMessage } from '#/utils/functions'
import { Button } from '#/components/ui/button'

const schema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
  confirmPassword: z.string().min(1),
}).refine(schema => schema.password === schema.confirmPassword, 'Passwords don\'t match')

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

  return (
    <div>
      <Form
        method="post"
        {...getFormProps(form)}
      >
        <div>
          <label className="block" htmlFor={fields.email.id}>Email</label>
          <input {...getInputProps(fields.email, { type: 'email' })} required />
          {fields.email.errors ? <p>{fields.email.errors}</p> : null}
        </div>
        <div>
          <label className="block" htmlFor={fields.password.id}>Password</label>
          <input {...getInputProps(fields.password, { type: 'password' })} required />
          {fields.password.errors ? <p>{fields.password.errors}</p> : null}
        </div>
        <div>
          <label className="block" htmlFor={fields.confirmPassword.id}>Confirm Password</label>
          <input {...getInputProps(fields.confirmPassword, { type: 'password' })} required />
          {fields.confirmPassword.errors ? <p>{fields.confirmPassword.errors}</p> : null}
        </div>
        {form.errors
          ? (
              <div>
                <p id={form.errorId}>{form.errors}</p>
              </div>
            )
          : null}
        <div>
          <Button type="submit" className="bg-black text-white">
            Sign Up
          </Button>
        </div>
      </Form>
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

  const { supabaseClient } = createClient(request)
  const { error } = await supabaseClient.auth.signUp({
    email: submission.value.email,
    password: submission.value.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return {
      errors: submission.reply({
        formErrors: [getErrorMessage(error)],
      }),
    }
  }

  throw redirect('/profile')
}
