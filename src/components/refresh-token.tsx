import { checkAndRefreshToken, getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage, setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import jwt from 'jsonwebtoken'
import authApiRequest from "@/apiRequests/auth";

// Những page sau sẽ không check refresh token
const UNAUTHENTICATED_PATH = ['/login', '/logout', '/refresh-token']
export default function RefreshToken() {
    const pathname = usePathname()
    useEffect(() => {
        if (UNAUTHENTICATED_PATH.includes(pathname)) return
        let interval: any = null
        // Phải gọi lần đầu tiên, vì interval sẽ chạy sau thời gian TIMEOUT
        checkAndRefreshToken({
            onError: () => {
                clearInterval(interval)
            }
        })
        // Timeout interval phải bé hơn thời gian hết hạn của access token
        // Ví dụ thời gian hết hạn access token là 10s thì 1s sẽ cho check 1 lần 
        const TIMEOUT = 1000
        interval = setInterval(checkAndRefreshToken, TIMEOUT)
        return () => {
            clearInterval(interval)
        }
    }, [pathname])
    return null
}
