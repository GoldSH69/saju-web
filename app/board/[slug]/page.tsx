import { Metadata } from 'next'
import BoardListClient from '@/components/BoardListClient'

const categoryMeta: Record<string, { title: string; description: string }> = {
  notice: { title: '공지사항', description: '사주명리학 서비스 공지사항' },
  faq: { title: 'FAQ', description: '사주명리학 자주 묻는 질문과 답변' },
  feedback: { title: '의견/건의', description: '서비스 개선을 위한 의견과 건의' },
  bug: { title: '버그 신고', description: '서비스 오류 및 버그 신고' },
  free: { title: '자유게시판', description: '자유롭게 이야기를 나누는 공간' },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const meta = categoryMeta[slug]

  if (!meta) {
    return { title: '게시판' }
  }

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: `${meta.title} | 사주명리학`,
      description: meta.description,
    },
  }
}

export default function BoardListPage() {
  return <BoardListClient />
}