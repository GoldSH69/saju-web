import { Metadata } from 'next'
import BoardDetailClient from '@/components/BoardDetailClient'

export const metadata: Metadata = {
  title: '게시글',
  description: '사주명리학 게시판 글 상세',
  robots: {
    index: false,
    follow: true,
  },
}

export default function BoardDetailPage() {
  return <BoardDetailClient />
}