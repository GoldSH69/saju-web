'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  author_type: string
  guest_nickname: string | null
  is_pinned: boolean
  view_count: number
  admin_reply: string | null
  created_at: string
}

interface Category {
  id: string
  slug: string
  name: string
  description: string | null
  allow_guest: boolean
  admin_only: boolean
}

export default function BoardListPage() {
  const params = useParams()
  const slug = params.slug as string

  const [category, setCategory] = useState<Category | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/board/posts?category=${slug}&page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setCategory(null)
        } else {
          setCategory(data.category)
          setPosts(data.posts || [])
          setTotalPages(data.totalPages || 1)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug, page])

  function formatDate(dateStr: string) {
    const d = new Date(dateStr)
    const now = new Date()
    const isToday =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()

    if (isToday) {
      return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    }
    return d.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })
  }

  function authorName(post: Post) {
    if (post.author_type === 'admin') return '관리자'
    return post.guest_nickname || '익명'
  }

  if (loading) {
    return <p className="text-center text-slate-400 py-16">불러오는 중...</p>
  }

  if (!category) {
    return <p className="text-center text-slate-400 py-16">존재하지 않는 게시판입니다</p>
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/board" className="text-sm text-slate-400 hover:text-slate-600">
            ← 게시판 목록
          </Link>
          <h1 className="text-2xl font-bold text-slate-700 mt-1">{category.name}</h1>
        </div>
        {!category.admin_only && (
          <Link
            href={`/board/${slug}/write`}
            className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-4 py-2 rounded-lg text-sm shadow-sm"
          >
            ✏️ 글쓰기
          </Link>
        )}
      </div>

      {/* 글 목록 */}
      {posts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
          <p className="text-slate-400">아직 게시글이 없습니다</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {posts.map((post, idx) => (
            <Link
              key={post.id}
              href={`/board/${slug}/${post.id}`}
              className={`block p-4 hover:bg-slate-50 transition-colors ${
                idx > 0 ? 'border-t border-slate-100' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {post.is_pinned && (
                      <span className="text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded font-bold">
                        고정
                      </span>
                    )}
                    <h3 className="text-slate-700 font-medium truncate">
                      {post.title}
                    </h3>
                    {post.admin_reply && (
                      <span className="text-xs text-emerald-500 font-medium">[답변완료]</span>
                    )}
                  </div>
                  <div className="flex gap-3 mt-1 text-xs text-slate-400">
                    <span>{authorName(post)}</span>
                    <span>{formatDate(post.created_at)}</span>
                    <span>조회 {post.view_count}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-1 rounded-lg border border-slate-200 text-sm text-slate-500 hover:border-slate-400 disabled:opacity-30"
          >
            이전
          </button>
          <span className="px-3 py-1 text-sm text-slate-500">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1 rounded-lg border border-slate-200 text-sm text-slate-500 hover:border-slate-400 disabled:opacity-30"
          >
            다음
          </button>
        </div>
      )}
    </div>
  )
}