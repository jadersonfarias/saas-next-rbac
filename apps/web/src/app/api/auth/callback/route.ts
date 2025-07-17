// import { NextRequest, NextResponse } from 'next/server'
// import { signInWithGithub } from '@/http/sign-in-with-github'

// export async function GET(request: NextRequest) {
//   const searchParams = request.nextUrl.searchParams
//   const code = searchParams.get('code')

//   if (!code) {
//     return NextResponse.json(
//       { message: 'Github OAuth code was not found.' },
//       { status: 400 },
//     )
//   }

//   const { token } = await signInWithGithub({ code })

//   const redirectUrl = new URL('/', request.url)
//   const response = NextResponse.redirect(redirectUrl)

//   response.cookies.set('token', token, {
//     path: '/',
//     maxAge: 60 * 60 * 24 * 7, // 7 days
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//   })

//   return response
// }

import { NextRequest, NextResponse } from 'next/server'
import { signInWithGithub } from '@/http/sign-in-with-github'
import { cookies } from 'next/headers'
import { acceptInvite } from '@/http/accept-invite'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json(
      { message: 'Github OAuth code was not found.' },
      { status: 400 },
    )
  }

  const { token } = await signInWithGithub({ code })

  const inviteId = (await cookies()).get('inviteId')?.value


    if (inviteId) {
      try {
        await acceptInvite(inviteId)
        ;(await cookies()).delete('inviteId')
      } catch (e) {
        console.log(e)
      }
    }
  const redirectUrl = new URL('/', request.url)
  const response = NextResponse.redirect(redirectUrl)

  response.cookies.set('token', token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    secure: false,
  })

  return response
}
