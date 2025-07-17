import { redirect } from 'next/navigation'
 
 import { isAuthenticated } from '@/auth/auth'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    const authenticated = await isAuthenticated()
    if (authenticated) {
      redirect('/')
    }
    return (
        <div className="min-h-screen flex  items-center justify-center flex-col px-4">
            <div className="w-full max-w-xs">
                {children}
            </div>
        </div>
    );
}