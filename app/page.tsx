import { Metadata } from 'next'
import HomeClient from '@/components/HomeClient'

export const metadata: Metadata = {
  title: '무료 사주팔자 계산 - 만세력 기반 사주 분석',
  description: '정확한 만세력 기반 무료 사주팔자 계산. 오행 분포, 십성 분석, 대운·세운, 오늘의 운세까지 한 번에 확인하세요.',
  openGraph: {
    title: '무료 사주팔자 계산 - 만세력 기반 사주 분석',
    description: '정확한 만세력 기반 무료 사주팔자 계산. 오행·십성·대운·세운·오늘의 운세까지.',
  },
}

export default function Home() {
  return <HomeClient />
}