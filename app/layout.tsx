import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: '사주명리학 - 무료 사주팔자 계산',
  description: '정확한 사주팔자 계산과 운세 서비스. 만세력 기반 무료 사주 분석.',
  keywords: '사주, 사주팔자, 만세력, 운세, 사주명리학, 오행, 십성',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-slate-800 text-slate-400 text-center py-6 text-sm">
            <p>© 2025 사주명리학 · 본 서비스는 참고용이며 전문 상담을 대체하지 않습니다.</p>
          </footer>
        </div>
      </body>
    </html>
  )
}