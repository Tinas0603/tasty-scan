'use client'

import { useAppStore } from "@/components/app-provider"
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from "@/lib/utils"
import { useLogoutMutation } from "@/queries/useAuth"
import { useRouter, useSearchParams } from "next/navigation"
import { memo, Suspense, useEffect, useRef } from "react"

function LogoutComponent() {
    const { mutateAsync } = useLogoutMutation()
    const router = useRouter()
    const disconnectSocket = useAppStore((state) => state.disconnectSocket)
    const setRole = useAppStore((state) => state.setRole)
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
                setRole()
                disconnectSocket()
            })
        }
    }, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl, setRole, disconnectSocket])
    return null
}

const Logout = memo(function LogoutInner() {
    return (
        <Suspense>
            <LogoutComponent />
        </Suspense>
    )
})

export default Logout