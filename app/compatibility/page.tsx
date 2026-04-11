import { Metadata } from 'next'
import { Suspense } from 'react'
import CompatibilityClient from '@/components/CompatibilityClient'

export const metadata: Metadata = {
  title: '궁합 분석',
  description: '사주명리학 기반 궁합 분석 — 일간 오행, 용신 보완, 십성, 일지 궁합, 오행 균형까지 5가지 항목으로 두 사람의 궁합을 분석합니다.',
  robots: { index: true, follow: true },
}

export default function CompatibilityPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50/60 via-white to-pink-50/40 px-4 py-8">
      <Suspense fallback={
        <div className="text-center py-20 text-slate-400">불러오는 중...</div>
      }>
        <CompatibilityClient />
      </Suspense>
    </main>
  )
}