'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  content: string
  author_type: string
  guest_nickname: string | null
  is_pinned: boolean
  view_count: number
  admin_reply: string | null
  admin_reply_at: string | null
  created_at: string
  updated_at: string
  category: { slug: string; name: string } | null
}

export default function BoardDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const id = params.id as string

  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch(`/api/board/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.post) setPost(data.post)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  function formatDate(dateStr: string) {
    const d = new Date(dateStr)
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function authorName() {
    if (!post) return ''
    if (post.author_type === 'admin') return '🛡️ 관리자'
    return post.guest_nickname || '익명'
  }

  async function handleDelete() {
    setDeleteError('')
    setDeleting(true)

    try {
      const res = await fetch(`/api/board/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guest_password: deletePassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        setDeleteError(data.error || '삭제에 실패했습니다')
        setDeleting(false)
        return
      }

      router.push(`/board/${slug}`)
    } catch {
      setDeleteError('네트워크 오류가 발생했습니다')
      setDeleting(false)
    }
  }

  if (loading) {
    return <p className="text-center text-slate-400 py-16">불러오는 중...</p>
  }

  if (!post) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400">게시글을 찾을 수 없습니다</p>
        <Link href={`/board/${slug}`} className="text-amber-500 text-sm mt-4 inline-block">
          ← 목록으로
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* 상단 네비 */}
      <Link href={`/board/${slug}`} className="text-sm text-slate-400 hover:text-slate-600">
        ← {post.category?.name || '게시판'} 목록
      </Link>

      {/* 글 헤더 */}
      <div className="mt-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          {post.is_pinned && (
            <span className="text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded font-bold">
              고정
            </span>
          )}
          <h1 className="text-xl font-bold text-slate-700">{post.title}</h1>
        </div>
        <div className="flex gap-4 text-sm text-slate-400">
          <span>{authorName()}</span>
          <span>{formatDate(post.created_at)}</span>
          <span>조회 {post.view_count}</span>
        </div>
      </div>

      {/* 글 내용 */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 min-h-[200px] shadow-sm">
        <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </div>
      </div>

      {/* 관리자 답변 */}
      {post.admin_reply && (
        <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-emerald-600 font-bold text-sm">🛡️ 관리자 답변</span>
            {post.admin_reply_at && (
              <span className="text-xs text-slate-400">{formatDate(post.admin_reply_at)}</span>
            )}
          </div>
          <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">
            {post.admin_reply}
          </div>
        </div>
      )}

      {/* 하단 버튼 */}
      <div className="flex justify-between items-center">
        <Link
          href={`/board/${slug}`}
          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-500 text-sm hover:border-slate-400"
        >
          목록
        </Link>

        {post.author_type === 'guest' && (
          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-sm text-red-400 hover:text-red-500"
          >
            삭제
          </button>
        )}
      </div>

      {/* 삭제 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-sm shadow-lg">
            <h3 className="text-slate-700 font-bold mb-4">게시글 삭제</h3>
            <p className="text-sm text-slate-400 mb-3">
              작성 시 입력한 비밀번호를 입력해주세요
            </p>

            {deleteError && (
              <p className="text-sm text-red-500 mb-3">{deleteError}</p>
            )}

            <input
              type="password"
              value={deletePassword}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 4)
                setDeletePassword(val)
              }}
              placeholder="숫자 4자리"
              maxLength={4}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-700 text-sm mb-4 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-200"
            />

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeletePassword('')
                  setDeleteError('')
                }}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-500 text-sm"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting || deletePassword.length !== 4}
                className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
              >
                {deleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}