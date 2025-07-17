import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth' // Middleware de autenticação
import { UnauthorizedError } from '@/http/_errors/unauthorized-error' // Erro personalizado para autorização
import { prisma } from '@/lib/prisma' // Cliente Prisma para interagir com o banco de dados
import { createSlug } from '@/utils/create-slug' // Função para criar um slug a partir do nome
import { getUserPermissions } from '@/utils/get-user-permissions' // Função para verificar permissões do usuário

export async function createProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth) // Registra o middleware de autenticação
    .post(
      '/organizations/:slug/projects', // Define a rota para criar projetos
      {
        schema: {
          tags: ['Projects'], // Categoria da rota na documentação
          summary: 'Create a new project', // Resumo da funcionalidade
          security: [{ bearerAuth: [] }], // Exige autenticação via token Bearer
          body: z.object({
            name: z.string(), // O corpo da requisição deve conter o nome do projeto
            description: z.string(), // E uma descrição do projeto
          }),
          params: z.object({
            slug: z.string(), // O parâmetro da URL deve conter o slug da organização
          }),
          response: {
            201: z.object({
              projectId: z.string().uuid(), // Resposta com o ID do projeto criado
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params // Obtém o slug da organização da URL
        const userId = await request.getCurrentUserId() // Obtém o ID do usuário autenticado
        const { organization, membership } =
          await request.getUserMembership(slug) // Verifica a associação do usuário à organização

        const { cannot } = getUserPermissions(userId, membership.role) // Verifica as permissões do usuário

        // Se o usuário não tiver permissão para criar projetos, lança um erro
        if (cannot('create', 'Project')) {
          throw new UnauthorizedError(
            `You're not allowed to create new projects.`
          )
        }

        const { name, description } = request.body // Obtém o nome e a descrição do projeto do corpo da requisição

        // Cria o projeto no banco de dados
        const project = await prisma.project.create({
          data: {
            name, // Nome do projeto
            slug: createSlug(name), // Gera um slug único para o projeto
            description, // Descrição do projeto
            organizationId: organization.id, // ID da organização associada
            ownerId: userId, // ID do usuário que criou o projeto
          },
        })

        // Retorna o ID do projeto criado com status 201 (Criado)
        return reply.status(201).send({
          projectId: project.id,
        })
      }
    )
}
