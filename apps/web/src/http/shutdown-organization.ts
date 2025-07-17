import { api } from './api-client'

interface ShutdownOrganizationRequest {
  org: string | null
}

export async function shutdownOrganization({
  org,
}: ShutdownOrganizationRequest) {
  await api.delete(`organizations/${org}`)
}