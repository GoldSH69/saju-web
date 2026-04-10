import { Metadata } from 'next'
import SavedSajuClient from '@/components/SavedSajuClient'

export const metadata: Metadata = {
  title: '사주리스트',
  description: '저장된 사주 정보를 관리하고 빠르게 조회하세요.',
  robots: { index: false },
}

export default function SavedPage() {
  return <SavedSajuClient />
}