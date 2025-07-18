
import { AbilityBuilder } from '@casl/ability'
 
import { AppAbility } from '.'
import { User } from './models/user'
import { Role } from './roles'
 
 // type Role = 'ADMIN' | 'MEMBER'
 
 type PermissionsByRole = (
   user: User,
   builder: AbilityBuilder<AppAbility>,
 ) => void
 
 export const permissions: Record<Role, PermissionsByRole> = {
   ADMIN(user, { can, cannot }) {
    can('manage', 'all')

    cannot(['transfer_ownership', 'update'], 'Organization')// não pode transferir organizações
    can(['transfer_ownership', 'update'], 'Organization', {
      ownerId: { $eq: user.id },
    }) // apenas com o id igual a do usuario
   
   },
   MEMBER(user, { can }) {
    can('get', 'User')
    can(['create', 'get'], 'Project')
    can(['update', 'delete'], 'Project', { ownerId: { $eq: user.id } })
   },
   BILLING(_, { can }){
    can('manage', 'Billing')
   }
 }