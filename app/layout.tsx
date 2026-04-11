import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import VisitorTracker from '@/components/VisitorTracker'

export const metadata: Metadata = {
  metadataBase: new URL('https://saju-web.vercel.app'), // 배포 후 실제 도메인으로 변경
  title: {
    default: '사주명리학 - 무료 사주팔자 계산',
    template: '%s | 사주명리학',
  },
  description: '정확한 사주팔자 계산과 운세 서비스. 만세력 기반 무료 사주 분석. 사주명리학 기초 교육까지.',
  keywords: '사주, 사주팔자, 만세력, 운세, 사주명리학, 오행, 십성, 천간, 지지, 사주배우기',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '사주명리학',
    title: '사주명리학 - 무료 사주팔자 계산',
    description: '정확한 만세력 기반 무료 사주 분석과 사주명리학 기초 교육',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        {/* 한자 전용 웹폰트 (Noto Serif KR - Google Fonts, OFL 무료) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <VisitorTracker />
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-slate-800 text-center py-6">
            <p className="text-slate-300 text-sm">© 2026 사주명리. Built by @shlee.</p>
            <p className="text-slate-500 text-xs mt-1">본 서비스는 참고용 정보 제공을 목적으로 하며, 전문 상담을 대체하지 않습니다.</p>
          </footer>
        </div>
      </body>
    </html>
  )
}