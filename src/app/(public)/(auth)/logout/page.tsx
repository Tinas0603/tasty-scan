'use client'

import { useAppContext } from "@/components/app-provider"
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from "@/lib/utils"
import { useLogoutMutation } from "@/queries/useAuth"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useRef } from "react"

function Logout() {
    const { mutateAsync } = useLogoutMutation()
    const router = useRouter()
    const { setIsAuth } = useAppContext()
    const ref = useRef<any>(null)
    const searchParams = useSearchParams()
    const refreshTokenFromUrl = searchParams.get('refreshToken')
    const accessTokenFromUrl = searchParams.get('accessToken')
    useEffect(() => {
        if (
            !ref.current &&
            ((refreshTokenFromUrl &&
                refreshTokenFromUrl === getRefreshTokenFromLocalStorage()) ||
                (accessTokenFromUrl &&
                    accessTokenFromUrl === getAccessTokenFromLocalStorage()))
        ) {
            ref.current = mutateAsync
            mutateAsync().then((res) => {
                setTimeout(() => {
                    ref.current = null
                }, 1000)
                setIsAuth(false)
                router.push('/login')
            })
        } else {
            router.push('/')
        }
    }, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl])
    return (
        <div>
            Logout...
        </div>
    )
}

export default function LogOutPage() {
    return (
        <Suspense>
            <Logout />
        </Suspense>
    )
}