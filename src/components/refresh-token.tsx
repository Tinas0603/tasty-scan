import { checkAndRefreshToken } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

// Những page sau sẽ không check refresh token
const UNAUTHENTICATED_PATH = ['/login', '/logout', '/refresh-token']
export default function RefreshToken() {
    const pathname = usePathname()
    const router = useRouter()
    useEffect(() => {
        if (UNAUTHENTICATED_PATH.includes(pathname)) return
        let interval: any = null
        // Phải gọi lần đầu tiên, vì interval sẽ chạy sau thời gian TIMEOUT
        checkAndRefreshToken({
            onError: () => {
                clearInterval(interval)
                router.push('/login')
            }
        })
        // Timeout interval phải bé hơn thời gian hết hạn của access token
        // Ví dụ thời gian hết hạn access token là 1h thì 6p sẽ cho check 1 lần 
        const TIMEOUT = 360000
        interval = setInterval(() => checkAndRefreshToken({
            onError: () => {
                clearInterval(interval)
                router.push('/login')
            }
        }), TIMEOUT)
        return () => {
            clearInterval(interval)
        }
    }, [pathname, router])
    return null
}

