'use server'

import { rejectInvite } from "@/http/reject-invite";
import { revalidateTag } from "next/cache";

export async function acceptInviteAction(inviteId: string) {
    await acceptInviteAction(inviteId)

    revalidateTag('organizations')
}

export async function rejectInviteAction(inviteId: string) {
  await rejectInvite(inviteId)
}