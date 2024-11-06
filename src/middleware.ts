import { NextResponse, type NextRequest } from 'next/server'

const privatePaths = ['/manage']
const unAuthPaths = ['/login']

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    //pathname: /manage/dashboard
    const accessToken = request.cookies.get('accessToken')?.value
    const refreshToken = request.cookies.get('refreshToken')?.value
    //1. chưa đăng nhập thì không cho vào private paths
    if (privatePaths.some(path => pathname.startsWith(path)) && !refreshToken) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // 2. Trường hợp đã đăng nhập
    // 2.1 Đăng nhập rồi thì sẽ không cho vào login nữa. Nếu cố tình vào trang login sẽ redirect về trang chủ
    if (unAuthPaths.some(path => pathname.startsWith(path)) && refreshToken) {
        return NextResponse.redirect(new URL('/', request.url))
    }
    // 2.2 Trường hợp đăng nhập rồi nhưng accessToken lại hết hạn
    if (
        privatePaths.some(path => pathname.startsWith(path)) &&
        !accessToken &&
        refreshToken
    ) {
        const url = new URL('/logout', request.url)
        url.searchParams.set('refreshToken', refreshToken)
        return NextResponse.redirect(url)
    }
    // 2.3 Các trường hợp còn lại thì diễn ra bình thường
    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/manage/:path*', '/login'],
}