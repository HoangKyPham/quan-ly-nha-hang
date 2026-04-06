import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 

const managePath = ['/manage']
const privatePaths = [...managePath]
const unAuthPaths = ['/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  //pathname : manage/dashboard
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  //1. Chưa đăng nhập thì không cho vào private paths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL('/login', request.url)
    url.searchParams.set('clearTokens', 'true')
    return NextResponse.redirect(url)
  }

  // 2.Trường hợp đã đăng nhập
  if(refreshToken){
    //2.1 Nếu cố tình vào trang login thì chuyển về trang chủ
    if(unAuthPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    // 2.2 Access token hết hạn
    if(privatePaths.some((path) => pathname.startsWith(path)) && !accessToken){
      // chạy vào /refresh-token thực hiện hàm RefreshTokenPage()
      const url = new URL('/refresh-token', request.url)
      url.searchParams.set('refreshToken', refreshToken)
      //ghi nhớ lại path mà người dùng đang muốn truy cập để sau khi refresh token xong thì redirect về đúng path đó
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }


  }
  // 2.3 Vào không đúng role, redirect về trang chủ

  return NextResponse.next()
}
 
export const config = {
    matcher: ['/login', '/manage/:path*']
}