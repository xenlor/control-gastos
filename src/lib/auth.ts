import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export async function getCurrentUser() {
    const session = await auth()

    if (!session?.user?.email || !session.user.id) {
        redirect('/login')
    }

    return {
        id: session.user.id as string,
        email: session.user.email,
        name: session.user.name,
    }
}
