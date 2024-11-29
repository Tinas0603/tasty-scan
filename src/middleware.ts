import { NextResponse, type NextRequest } from 'next/server'
import { decodeToken } from './lib/utils'
import { Role } from './constants/type'

const managePaths = ['/manage']
const guestPaths = ['/guest']
const onlyOwnerPaths = ['manage/accounts']
const privatePaths = [...managePaths, ...guestPaths]
const unAuthPaths = ['/login']
const loginPaths = ['/login']
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl
    //pathname: /manage/dashboard
    const accessToken = request.cookies.get('accessToken')?.value
    const refreshToken = request.cookies.get('refreshToken')?.value
    //1. chưa đăng nhập thì không cho vào private paths
    if (privatePaths.some(path => pathname.startsWith(path)) && !refreshToken) {
        const url = new URL('/login', request.url)
        url.searchParams.set('clearTokens', 'true')
        return NextResponse.redirect(url)
    }
    console.log(searchParams.get('accessToken'))
    // 2. Trường hợp đã đăng nhập
    if (refreshToken) {
        // 2.1. Đăng nhập rồi thì sẽ không cho vào login nữa.
        // Nếu cố tình vào trang login sẽ redirect về trang chủ
        if (unAuthPaths.some(path => pathname.startsWith(path)) && refreshToken) {
            if (
                loginPaths.some((path) => pathname.startsWith(path)) &&
                searchParams.get('accessToken')
            ) {
                return NextResponse.next()
            }
            return NextResponse.redirect(new URL('/', request.url))
        }
        // 2.2 Trường hợp đăng nhập rồi nhưng accessToken lại hết hạn
        if (
            privatePaths.some(path => pathname.startsWith(path)) &&
            !accessToken &&
            refreshToken
        ) {
            const url = new URL('/refresh-token', request.url)
            url.searchParams.set('refreshToken', refreshToken)
            url.searchParams.set('redirect', pathname)

            return NextResponse.redirect(url)
        }
        // 2.3 Vào không đúng role(vd khách cố tình truy cập vào role của nhân viên,...), redirect về trang chủ
        const role = decodeToken(refreshToken).role
        // Guest nhưng cố vào route owner
        const isGuestGoToManagePath =
            role === Role.Guest &&
            managePaths.some((path) => pathname.startsWith(path))
        // Không phải Guest nhưng cố vào route guest
        const isNotGuestGoToGuestPath =
            role !== Role.Guest &&
            guestPaths.some((path) => pathname.startsWith(path))
        // Không phải Owner nhưng cố tình truy cập vào route dành cho Owner
        const isNotOwnerGoToOwnerPath = role !== Role.Owner && onlyOwnerPaths.some((path) => pathname.startsWith(path))
        if (isGuestGoToManagePath ||
            isNotGuestGoToGuestPath ||
            isNotOwnerGoToOwnerPath
        ) {
            return NextResponse.redirect(new URL('/', request.url))
        }
        // 2.4 Các trường hợp còn lại thì diễn ra bình thường
        return NextResponse.next()
    }
    return NextResponse.next()
}
// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/manage/:path*', '/guest/:paths*', '/login'],
}
