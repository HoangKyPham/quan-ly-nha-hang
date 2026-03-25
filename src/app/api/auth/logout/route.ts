import authApiRequest from '@/apiRequests/auth'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')
  const refreshToken = cookieStore.get('refreshToken')
  if (!accessToken || !refreshToken) {
    cookieStore.delete('accessToken')
    cookieStore.delete('refreshToken')
    return Response.json(
      {
        message: 'Không nhận được access token hoặc refresh token, buộc phải xóa cookie'
      },
      {
        status: 200
      }
    )
  }
  try {
    const result = await authApiRequest.logoutFromNextServerToServer({
      accessToken: accessToken?.value,
      refreshToken: refreshToken?.value
    })
    cookieStore.delete('accessToken')
    cookieStore.delete('refreshToken')
    return Response.json(result.payload)
  } catch (error) {
    cookieStore.delete('accessToken')
    cookieStore.delete('refreshToken')
    return Response.json(
      {
        message: 'Lỗi khi gọi API đến server backend, buộc phải xóa cookie'
      },
      {
        status: 200
      }
    )
  }
}
