'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function VisitorTracker() {
  const pathname = usePathname()
  const lastTracked = useRef<string>('')

  useEffect(() => {
    // 같은 경로 중복 호출 방지
    if (pathname === lastTracked.current) return
    lastTracked.current = pathname

    // 봇/프리렌더 제외
    if (typeof navigator === 'undefined') return
    const ua = navigator.userAgent.toLowerCase()
    if (ua.includes('bot') || ua.includes('crawler') || ua.includes('spider')) return

    // 트래킹 API 호출 (fire-and-forget)
    fetch('/api/tracking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer || '',
      }),
    }).catch(() => {
      // 트래킹 실패는 무시 (사용자 경험에 영향 없음)
    })
  }, [pathname])

  return null
}