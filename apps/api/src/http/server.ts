import { fastify } from 'fastify'
import fastifyCors from '@fastify/cors'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import fastifySwagger from '@fastify/swagger'
import fastifyJwt from '@fastify/jwt'
import fastifySwaggerUI from '@fastify/swagger-ui'

import { createAccount } from './routes/auth/create-account.js'
import { authenticateWithPassword } from './routes/auth/authenticate-with-password.js'
import { getProfile } from './routes/auth/get-profile.js'
import { errorHandler } from './error-handler.js'
import { requestPasswordRecover } from './routes/auth/request-password-recover.js'
import { resetPassword } from './routes/auth/reset-password.js'
import { authenticateWithGithub } from './routes/auth/authenticate-with-github.js'
import { env } from '@saas/env'
import { createOrganization } from './routes/orgs/create-organization.js'
import { getMembership } from './routes/orgs/get-membership.js'
import { getOrganizations } from './routes/orgs/get-organizations.js'
import { getOrganization } from './routes/orgs/get-organization.js'
import { updateOrganization } from './routes/orgs/update-organization.js'
import { shutdownOrganization } from './routes/orgs/shutdown-organization.js'
import { transferOrganization } from './routes/orgs/transfer-organization.js'
import { createProject } from './routes/projects/create-project.js'
import { deleteProject } from './routes/projects/delete-project.js'
import { getProject } from './routes/projects/get-project.js'
import { getProjects } from './routes/projects/get-projects.js'
import { updateProject } from './routes/projects/update-project.js'
import { getMembers } from './routes/members/get-members.js'
import { updateMember } from './routes/members/update-member.js'
import { removeMember } from './routes/members/remove-member.js'
import { createInvite } from './routes/invites/create-invite.js'
import { getInvite } from './routes/invites/get-invite.js'
import { getInvites } from './routes/invites/get-invites.js'
import { acceptInvite } from './routes/invites/accept-invite.js'
import { rejectInvite } from './routes/invites/reject-invite.js'
import { revokeInvite } from './routes/invites/revoke-invite.js'
import { getPendingInvites } from './routes/invites/get-pending-invites.js'
import { getOrganizationBilling } from './routes/billing/get-organization-billing.js'

const app = fastify().withTypeProvider<ZodTypeProvider>() // Isso permite que o Fastify utilize Zod para validar requisições e respostas.

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Next.js SaaS',
      description: 'Full-stack SaaS with multi-tenant & RBAC.',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.setSerializerCompiler(serializerCompiler) // Define um compilador de serialização baseado no zod
app.setValidatorCompiler(validatorCompiler) // Define um compilador de validação baseado no zod
app.setErrorHandler(errorHandler)

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(fastifyCors) //permitindo que o servidor aceite requisições de diferentes origens.
app.register(createAccount)
app.register(authenticateWithPassword)
app.register(getProfile)
app.register(requestPasswordRecover)
app.register(resetPassword)
app.register(authenticateWithGithub)
app.register(createOrganization)
app.register(getMembership)
app.register(getOrganization)
app.register(getOrganizations)
app.register(updateOrganization)
app.register(shutdownOrganization)
app.register(transferOrganization)
app.register(deleteProject)

app.register(createProject)
app.register(getProject)
app.register(getProjects)
app.register(updateProject)
app.register(getMembers)
app.register(updateMember)
app.register(removeMember)
app.register(acceptInvite)

app.register(createInvite)
app.register(getInvite)
app.register(getInvites)
app.register(rejectInvite)
app.register(revokeInvite)
app.register(getPendingInvites)

app.register(getOrganizationBilling)

app.listen({ port: env.PORT }).then(() => {
  console.log('HTTP server running')
})
