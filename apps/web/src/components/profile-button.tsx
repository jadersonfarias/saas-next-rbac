import { ChevronDown, LogOut } from 'lucide-react'
 
 import { auth } from '@/auth/auth'
 
 import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
 } from './ui/dropdown-menu'
 
 function getInitials(name: string): string {
   const initials = name
     .split(' ')
     .map((word) => word.charAt(0).toUpperCase())
     .slice(0, 2)
     .join('')
 
   return initials
 }
 
 export async function ProfileButton() {
  console.log('Carregando ProfileButton...')
  try {
    const { user } = await auth()
    console.log('Usuário carregado:', user)

    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-3 outline-none">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
          <Avatar>
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
            {user.name && (
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            )}
          </Avatar>
          <ChevronDown className="size-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <a href="/api/auth/sign-out">
              <LogOut className="mr-2 size-4" />
              Sign Out
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  } catch (error) {
    console.error('Erro ao carregar o botão de perfil:', error)
    
    return null // Retorna `null` para evitar quebrar a página
  }
}