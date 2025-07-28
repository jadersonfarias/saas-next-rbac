'use server'

import { revalidateTag } from 'next/cache'

import { rejectInvite } from '@/http/reject-invite'

export async function acceptInviteAction(inviteId: string) {
  await acceptInviteAction(inviteId)

  revalidateTag('organizations')
}

export async function rejectInviteAction(inviteId: string) {
  await rejectInvite(inviteId)
}
