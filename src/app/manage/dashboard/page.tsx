import accountApiRequest from '@/apiRequests/account'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const cookieStore = await  cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  if (!accessToken) {
    redirect('/login')
  }
  let name = ''
  try {
    const result = await accountApiRequest.sMe(accessToken)
    name = result.payload.data.name
  } catch (error: any) {
    if (error.digest?.includes('NEXT_REDIRECT')) {
      throw error
    }
  }
  return <div>Dashboard {name}</div>
}
