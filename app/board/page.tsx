import { Metadata } from 'next'
import BoardClient from '@/components/BoardClient'

export const metadata: Metadata = {
  title: '게시판',
  description: '사주명리학 서비스 게시판. 공지사항, FAQ, 의견 및 건의, 자유게시판.',
  openGraph: {
    title: '게시판 | 사주명리학',
    description: '사주명리학 서비스 게시판. 공지사항, FAQ, 의견 및 건의, 자유게시판.',
  },
}

export default function BoardPage() {
  return <BoardClient />
}