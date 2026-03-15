import type { Metadata, Viewport } from 'next'
import './globals.css'
import { BottomNav } from '@/components/BottomNav'

export const metadata: Metadata = {
  title: 'Devestock - 物件見学ナレッジベース',
  description: 'デベロッパー社員のための物件見学記録・検索ツール',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen pb-16">
        <main className="max-w-3xl mx-auto">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  )
}
