import { getCurrentOrg } from '@/auth/auth'
import { Header } from '@/components/header'
import { Tabs } from '@/components/tabs'

export default async function OrgLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {

    const currentOrg = await getCurrentOrg()

    return (
        <div>
            <div className="pt-6">
                <Header />
                <Tabs currentOrg={currentOrg ?? ''} />
            </div>

            <main className="mx-auto w-full max-w-[1200px] py-4">{children}</main>
        </div>
    )
}