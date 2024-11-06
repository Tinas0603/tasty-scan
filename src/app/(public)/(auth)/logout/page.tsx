'use client'

import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from "@/lib/utils"
import { useLogoutMutation } from "@/queries/useAuth"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"

export default function LogOutPage() {
    const { mutateAsync } = useLogoutMutation()
    const router = useRouter()
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
        )
            // if (
            //     ref.current || !refreshTokenFromUrl || !accessTokenFromUrl ||
            //     (refreshTokenFromUrl &&
            //         refreshTokenFromUrl !== getRefreshTokenFromLocalStorage()) ||
            //     (accessTokenFromUrl &&
            //         accessTokenFromUrl !== getAccessTokenFromLocalStorage())
            // ) {
            //     return
            // }
            ref.current = mutateAsync
        mutateAsync().then((res) => {
            setTimeout(() => {
                ref.current = null
            }, 1000)
            router.push('/login')
        })
    }, [mutateAsync, router, refreshTokenFromUrl, accessTokenFromUrl])
    return (
        <div>
            Logout Page
        </div>
    )

}