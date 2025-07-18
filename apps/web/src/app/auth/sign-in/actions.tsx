'use server'

import { cookies } from 'next/headers'
import { signInWithPassword } from '@/http/sign-in-with-password'
import { HTTPError } from 'ky'
import { z } from 'zod'
import { acceptInvite } from '@/http/accept-invite'

const signInSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please, provide a valid e-mail address.' }),
  password: z.string().min(1, { message: 'Please, provide your password.' }),
})


export async function signInWithEmailAndPassword( data: FormData) {
  const result = signInSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { email, password } = result.data

  try {
    const { token } = await signInWithPassword({
      email,
      password,
    })

    const cookieStore = await cookies()

    cookieStore.set('token', token, { 
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    
   const inviteId = cookieStore.get('inviteId')?.value

    if (inviteId) {
      try {
        await acceptInvite(inviteId)
        const cookieStore = await cookies()
        cookieStore.delete('inviteId')
      } catch (e) {
        console.log(e)
      }
    }

  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null }
    }
    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      errors: null,
    }
  }

  return { success: true, message: null, errors: null }
}
