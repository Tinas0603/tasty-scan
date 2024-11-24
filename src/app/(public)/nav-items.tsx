'use client'

import { useAppStore } from '@/components/app-provider'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Role } from '@/constants/type'
import { cn, handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { RoleType } from '@/types/jwt.types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const menuItems: {
  title: string
  href: string
  role?: RoleType[]
  hideWhenLogin?: boolean
}[] = [
    {
      title: 'Trang chủ',
      href: '/'
    },
    {
      title: 'Món ăn',
      href: '/guest/menu',
      role: [Role.Guest]
    },
    {
      title: 'Đơn hàng',
      href: '/guest/orders',
      role: [Role.Guest]
    },
    {
      title: 'Đăng nhập',
      href: '/login',
      hideWhenLogin: true
    },
    {
      title: 'Quản lý',
      href: '/manage/dashboard',
      role: [Role.Owner, Role.Employee]
    }
  ]
//Server: Món ăn, đăng nhập do server ko biết trạng thái đăng nhập của user
//Client: Đầu tiên hiển thị món ăn và đăng nhập. Nhưng ngay sau đó client render ra là Món ăn, đơn hàng
// quản lý do đã set được trạng thái đăng nhập
export default function NavItems({ className }: { className?: string }) {
  const role = useAppStore((state) => state.role)
  const setRole = useAppStore((state) => state.setRole)
  const disconnectSocket = useAppStore((state) => state.disconnectSocket)
  const logoutMutation = useLogoutMutation()
  const router = useRouter()
  const logout = async () => {
    if (logoutMutation.isPending) return
    try {
      await logoutMutation.mutateAsync()
      setRole()
      disconnectSocket()
      router.push('/')
    } catch (error: any) {
      handleErrorApi({
        error
      })
    }
  }
  return (
    <>
      {menuItems.map((item) => {
        // Trường hợp đăng nhập thì chỉ hiển thị menu đăng nhập
        const isAuth = item.role && role && item.role.includes(role)
        // Trường hợp menu item luôn hiển thị dù đã đăng nhập hoặc chưa đăng nhập
        const canShow = (item.role === undefined && !item.hideWhenLogin) || (!role && item.hideWhenLogin)
        if (isAuth || canShow) {
          return (
            <Link href={item.href} key={item.href} className={className}>
              {item.title}
            </Link>
          )
        }
        return null
      })}
      {role === Role.Guest && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className={cn(className, 'cursor-pointer')}>Đăng xuất</div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Bạn có muốn đăng xuất không?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Việc đăng xuất có thể làm mất đi hoá đơn của bạn
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                Huỷ
              </AlertDialogCancel>
              <AlertDialogAction onClick={logout}>Đồng ý</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )

}
