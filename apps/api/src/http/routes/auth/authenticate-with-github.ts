import { BadRequestError } from '@/http/_errors/bad-request-error'
import { prisma } from '@/lib/prisma'
import { env } from '@saas/env'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'


import z from 'zod'

export async function authenticateWithGithub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/github',
    {
      schema: {
        tags: ['auth'],
        summary: 'Authenticate with e-mail & password',
        body: z.object({
          code: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body

      const githubOAuthURL = new URL(
        'https://github.com/login/oauth/access_token'
      )

      githubOAuthURL.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID)
      githubOAuthURL.searchParams.set(
        'client_secret',
        env.GITHUB_OAUTH_CLIENT_SECRET
      )
      githubOAuthURL.searchParams.set(
        'redirect_uri',
       env.GITHUB_OAUTH_CLIENT_REDIRECT_URI
      )
      githubOAuthURL.searchParams.set('code', code)
      

      // const githubAccessTokenResponse = await fetch(githubOAuthURL, {
      //   method: 'POST',
      //   headers: {
      //     Accept: 'application/json',
      //   },
      // })

      const githubAccessTokenResponse = await fetch(
        'https://github.com/login/oauth/access_token',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: env.GITHUB_OAUTH_CLIENT_ID,
            client_secret: env.GITHUB_OAUTH_CLIENT_SECRET,
            redirect_uri: env.GITHUB_OAUTH_CLIENT_REDIRECT_URI,
            code,
          }),
        },
      )


      const githubAccessTokenData = await githubAccessTokenResponse.json()

      const { access_token: githubAccessToken } = z
        .object({
          access_token: z.string(),
          token_type: z.literal('bearer'),
          scope: z.string(),
        })
        .parse(githubAccessTokenData)

        const githubUserResponse = await fetch('https://api.github.com/user', {
            headers: {
              Authorization: `Bearer ${githubAccessToken}`,
            },
          })

          const githubUserData = await githubUserResponse.json() 
          
          // const {
          //   id: githubId,
          //   name,
          //   email,
          //   avatar_url: avatarUrl,
          // } = z
          //   .object({
          //     id: z.number().int().transform(String),
          //     avatar_url: z.string().url(),
          //     name: z.string().nullable(),
          //     email: z.string().nullable(),
          //   })
          //   .parse(githubUserData)

          //   if (email === null) {
          //       throw new BadRequestError(
          //         'Your GitHub account must have an email to authenticate.',
          //       )
          //     }

          const {
            id: githubId,
            name,
            avatar_url: avatarUrl,
          } = z
            .object({
              id: z.number().int().transform(String),
              avatar_url: z.string().url(),
              name: z.string().nullable(),
            })
            .parse(githubUserData)
          
          // Buscar os e-mails do usuário (é necessário o escopo 'user:email')
          const githubEmailsResponse = await fetch('https://api.github.com/user/emails', {
            headers: {
              Authorization: `Bearer ${githubAccessToken}`,
              Accept: 'application/vnd.github+json',
            },
          })
          
          const githubEmails = await githubEmailsResponse.json() as Array<{
            email: string;
            primary: boolean;
            verified: boolean;
          }>
          
          const primaryEmail = githubEmails.find(
            (email: any) => email.primary && email.verified,
          )?.email
          
          if (!primaryEmail) {
            throw new BadRequestError(
              'Your GitHub account must have a verified primary email to authenticate.',
            )
          }

            const email = primaryEmail
        
              let user = await prisma.user.findUnique({
                where: { email },
              })
        
              if (!user) {
                user = await prisma.user.create({
                  data: {
                    email,
                    name,
                    avatarUrl,
                  },
                })
              }
        
              let account = await prisma.account.findUnique({
                where: {
                  provider_userId: {
                    provider: 'GITHUB',
                    userId: user.id,
                  },
                },
              })
        
              if (!account) {
                account = await prisma.account.create({
                  data: {
                    provider: 'GITHUB',
                    providerAccountId: githubId,
                    userId: user.id,
                  },
                })
              }
        
              const token = await reply.jwtSign(
                {
                  sub: user.id,
                },
                {
                  sign: {
                    expiresIn: '7d',
                  },
                },
              )
              console.log(code)
        
              return reply.status(201).send({ token })
    }
  )
}
