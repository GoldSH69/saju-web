'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/', label: '홈', icon: '🏠' },
  { href: '/saju', label: '내 사주', icon: '🔮' },
  { href: '/fortune', label: '운세', icon: '⭐' },
  { href: '/learn', label: '배우기', icon: '📚' },
  { href: '/mypage', label: '마이', icon: '👤' },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      {/* 상단 로고 */}
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🔮</span>
          <span className="text-lg font-bold text-slate-800">사주명리학</span>
        </Link>
        <Link
          href="/auth/login"
          className="text-sm px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          로그인
        </Link>
      </div>

      {/* 하단 네비게이션 */}
      <nav className="max-w-4xl mx-auto px-4">
        <ul className="flex">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)

            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={`
                    flex flex-col items-center py-2 text-xs transition
                    ${isActive
                      ? 'text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-slate-500 hover:text-slate-800'
                    }
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="mt-0.5">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}