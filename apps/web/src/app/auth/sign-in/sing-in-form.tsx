'use client'
import { Label } from '@radix-ui/react-label'
import { Separator } from '@radix-ui/react-separator'
import { AlertTriangle, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import githubIcon from '@/assets/github-icon.svg'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useFormState } from '@/hook/use-form-state'

import { signInWithGithub } from '../actions'
import { signInWithEmailAndPassword } from './actions'

export function SingnInForm() {
  const router = useRouter()
  const SearchParams = useSearchParams()

  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    signInWithEmailAndPassword,
    () => {
      router.push('/')
    },
  )

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {success === false && message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Sign in failed!</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <Input
            name="email"
            type="email"
            id="email"
            defaultValue={SearchParams.get('email') ?? ''}
          />

          {errors?.email && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.email[0]}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input name="password" type="password" id="password" />

          {errors?.password && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.password[0]}
            </p>
          )}

          <Link
            href="/auth/forgot-password"
            className="text-foreground houver:uderline text-xs font-medium"
          >
            Forgot your password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Sign in with e-mail'
          )}
        </Button>

        <Button className="w-full" variant="link" size="sm" asChild>
          <Link href="/auth/sign-up">Create new account</Link>
        </Button>

        <Separator></Separator>
      </form>
      <form action={signInWithGithub}>
        <Button type="submit" variant="outline" className="w-full">
          <Image
            alt=""
            src={githubIcon}
            width={20}
            height={20}
            className="mr-2 size-4 dark:invert"
          />
          Sign in with GitHub
        </Button>
      </form>
    </div>
  )
}
