import { checkAndRefreshToken, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import React, { Suspense, useEffect } from 'react'


function RefreshToken () {
    const router = useRouter()
    const searchParams = useSearchParams()
    const refreshTokenFromURL = searchParams.get('refreshToken')
    const redirectPathname = searchParams.get('redirect')

    useEffect(() => {
        if(refreshTokenFromURL && refreshTokenFromURL === getRefreshTokenFromLocalStorage()){
            checkAndRefreshToken({
                onSuccess : () => {
                    router.push(redirectPathname || '/')
                }
            })
        }else {
            router.push('/login')
        }

    }, [router, refreshTokenFromURL, redirectPathname])

    return <div>Refresh token...</div>
}

const RefreshTokenPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RefreshToken />
    </Suspense>
  )
}

export default RefreshTokenPage