'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeIcon, MagnifyingGlassIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
} from '@heroicons/react/24/solid'

// ナビゲーション項目
const navItems = [
  {
    href: '/',
    label: 'ホーム',
    icon: HomeIcon,
    iconActive: HomeIconSolid,
  },
  {
    href: '/search',
    label: '横断検索',
    icon: MagnifyingGlassIcon,
    iconActive: MagnifyingGlassIconSolid,
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-3xl mx-auto flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = isActive ? item.iconActive : item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full tap-target ${
                isActive ? 'text-primary-700' : 'text-gray-500'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>

      {/* FAB: 新規登録ボタン */}
      <Link
        href="/properties/new"
        className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-primary-700 rounded-full flex items-center justify-center shadow-lg hover:bg-primary-800 transition-colors"
      >
        <PlusCircleIcon className="w-8 h-8 text-white" />
      </Link>
    </nav>
  )
}
