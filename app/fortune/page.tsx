import type { Metadata } from 'next'
import FortuneClient from '@/components/FortuneClient'

export const metadata: Metadata = {
  title: '오늘의 운세',
  description: '사주명리학 기반 오늘의 운세입니다. 생년월일시를 입력하면 오늘 하루의 운세, 행운의 색상·방향·숫자를 확인할 수 있습니다.',
  openGraph: {
    title: '오늘의 운세 — 사주명리학 기반',
    description: '내 사주로 보는 오늘의 운세. 매일 업데이트되는 일운 분석.',
  },
}

export default function FortunePage() {
  return <FortuneClient />
}