import { promises } from 'dns'
import { api } from './api-client'
 
 interface SignUpRequest {
   name: string
   email: string
   password: string
 }

 type SignUpResponse = never //nunca retorna nada
 
 export async function signUp({
   name,
   email,
   password,
 }: SignUpRequest): Promise<SignUpResponse> {
   const result = await api
     .post('users', {
       json: {
         name,
         email,
         password,
       },
     })
     .json<SignUpResponse>()
 
   return result
 }