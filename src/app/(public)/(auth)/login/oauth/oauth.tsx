'use client'

import { useAppStore } from "@/components/app-provider"
import { toast } from "@/hooks/use-toast"
import { decodeToken, generateSocketInstance } from "@/lib/utils"
import { useSetTokenToCookieMutation } from "@/queries/useAuth"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Google Login Redirect',
    description: 'Google Login Redirect',
    robots: {
        index: false
    }
}

export default function OAuthPage() {
    const { mutateAsync } = useSetTokenToCookieMutation()
    const router = useRouter()
    const count = useRef(0)
    const setSocket = useAppStore((state) => state.setSocket)
    const setRole = useAppStore((state) => state.setRole)
    const searchParams = useSearchParams()
    const accessToken = searchParams.get('accessToken')
    const refreshToken = searchParams.get('refreshToken')
    const message = searchParams.get('message')
    useEffect(() => {
        if (accessToken && refreshToken) {
            if (count.current === 0) {
                const { role } = decodeToken(accessToken)
                mutateAsync({ accessToken, refreshToken })
                    .then(() => {
                        setRole(role)
                        setSocket(generateSocketInstance(accessToken))
                        router.push('/manage/dashboard')
                    })
                    .catch((e) => {
                        toast({
                            description: e.message || 'Có lỗi xảy ra'
                        })
                    })
                count.current++
            }
        } else {
            if (count.current === 0) {
                setTimeout(() => {
                    toast({
                        description: message || 'Có lỗi xảy ra'
                    })
                })
                count.current++
            }
        }
    }, [
        accessToken,
        refreshToken,
        setRole,
        router,
        setSocket,
        message,
        mutateAsync
    ])
    return null
}