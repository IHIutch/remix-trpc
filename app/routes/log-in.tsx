import { Form, Link, useActionData, useNavigation } from '@remix-run/react'
import { z } from 'zod'
import type {
  ActionFunctionArgs,
} from '@remix-run/node'
import {
  redirect,
} from '@remix-run/node'
import { parseWithZod } from '@conform-to/zod'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { createClient } from '#/utils/supabase/supabase.server'
import { getErrorMessage } from '#/utils/functions'
import { Button } from '#/components/ui/button'

const schema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
})

export default function SignIn() {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()

  const [form, fields] = useForm({
    // Sync the result of last submission
    lastResult: navigation.state === 'idle' ? actionData?.errors : null,
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
          {fields.email.errors ? <p id={fields.email.descriptionId}>{fields.email.errors}</p> : null}
        </div>
        <div>
          <label className="block" htmlFor={fields.password.id}>Password</label>
          <input {...getInputProps(fields.password, { type: 'password' })} required />
          {fields.password.errors ? <p id={fields.password.descriptionId}>{fields.password.errors}</p> : null}
        </div>
        <div className="flex items-center justify-between">
          <Link to="/forgot">
            Forgot Password?
          </Link>
          <Button type="submit">
            Log In
          </Button>
        </div>
        <div>
          {form.errors ? (<p id={form.errorId}>{form.errors}</p>) : null}
        </div>
      </Form>
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

  return redirect('/protected', { headers })
}
