import {
  createMongoAbility,
  //ForcedSubject,
  CreateAbility,
  MongoAbility,
  AbilityBuilder,
} from '@casl/ability'

import { z } from 'zod'
import { User } from './models/user'
import { permissions } from './permissions'

import { billingSubject } from './subjects/billing'
 import { inviteSubject } from './subjects/invite'
 import { organizationSubject } from './subjects/organization'
 import { projectSubject } from './subjects/project'
 import { userSubject } from './subjects/user'


 export * from './models/organization'
 export * from './models/project'
 export * from './models/user'
 export * from './roles'


const appAbilitiesSchema = z.union([ // union  varios ou
  projectSubject,
  userSubject,
  organizationSubject,
  inviteSubject,
  billingSubject,
  z.tuple([z.literal('manage'), z.literal('all')]),
])

type AppAbilities = z.infer<typeof appAbilitiesSchema>

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

// const { build, can, cannot } = new AbilityBuilder(createAppAbility)

// can('invite', 'User')
// cannot('delete', 'User')

// export const ability = build()

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility)

  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`Permissions for role ${user.role} not found.`)
  }

  permissions[user.role](user, builder)

  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename
    }
  })

  ability.can = ability.can.bind(ability)
  ability.cannot = ability.cannot.bind(ability)

  return ability
}
