'use client'

import { getRefreshTokenFromLocalStorage } from "@/lib/utils"
import { useLogoutMutation } from "@/queries/useAuth"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"

export default function LogOutPage() {
    const { mutateAsync } = useLogoutMutation()
    const router = useRouter()
    const ref = useRef<any>(null)
    const searchParams = useSearchParams()
    const refreshTokenFromUrl = searchParams.get('refreshToken')
    useEffect(() => {
        if (ref.current || refreshTokenFromUrl !== getRefreshTokenFromLocalStorage()) {
            return
        }
        ref.current = mutateAsync
        mutateAsync().then((res) => {
            setTimeout(() => {
                ref.current = null
            }, 1000)
            router.push('/login')
        })
    }, [mutateAsync, router, refreshTokenFromUrl])
    return (
        <div>
            Logout Page
        </div>
    )

}