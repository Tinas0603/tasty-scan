'use client'

import { getAccessTokenFromLocalStorage } from '@/lib/utils'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const menuItems = [
  {
    title: 'Món ăn',
    href: '/menu' // authRequired = undefined luôn luôn hiển thị
  },
  {
    title: 'Đơn hàng',
    href: '/orders',
    authRequired: true
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    authRequired: false // khi false nghĩa là chưa đăng nhập thì sẽ hiển thị 
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    authRequired: true // đăng nhập rồi mới hiển thị
  }
]
//Server: Món ăn, đăng nhập do server ko biết trạng thái đăng nhập của user
//Client: Đầu tiên hiển thị món ăn và đăng nhập. Nhưng ngay sau đó client render ra là Món ăn, đơn hàng
// quản lý do đã set được trạng thái đăng nhập
export default function NavItems({ className }: { className?: string }) {
  const [isAuth, setIsAuth] = useState(false)
  useEffect(() => {
    setIsAuth(Boolean(getAccessTokenFromLocalStorage()))
  }, [])

  return menuItems.map((item) => {
    if (item.authRequired === false && isAuth ||
      item.authRequired === true && !isAuth
    )
      return null
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    )
  })
}
