import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'
import AppProvider from '@/components/app-provider'
import Footer from '@/components/footer'
import NextTopLoader from 'nextjs-toploader';
const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})
export const metadata: Metadata = {
  title: 'Bếp ẩm thực TastyScan',
  description: 'Sự tiện lợi trong mỗi lần quét, hương vị trong mỗi món ăn'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <NextTopLoader showSpinner={false} color='hsl(var(--foreground))' />
        <AppProvider>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
            <Footer />
          </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  )
}
