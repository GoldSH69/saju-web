'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Category {
  slug: string
  name: string
  allow_guest: boolean
  admin_only: boolean
}

export default function BoardWritePage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [category, setCategory] = useState<Category | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // reCAPTCHA v3 스크립트 로드
  // reCAPTCHA v3 스크립트 로드 + 페이지 떠날 때 제거
      // reCAPTCHA v3 스크립트 로드 + 배지 표시/숨김
  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
    if (!siteKey) return

    const w = window as any

    // 이미 로드됨 → 배지만 다시 표시
    if (w.grecaptcha) {
      const badge = document.querySelector('.grecaptcha-badge') as HTMLElement
      if (badge) badge.style.visibility = 'visible'
      return () => {
        const badge = document.querySelector('.grecaptcha-badge') as HTMLElement
        if (badge) badge.style.visibility = 'hidden'
      }
    }

    // 첫 로드 → 스크립트 추가
    if (!document.querySelector(`script[src*="recaptcha"]`)) {
      const script = document.createElement('script')
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
      script.async = true
      document.head.appendChild(script)
    }

    return () => {
      const badge = document.querySelector('.grecaptcha-badge') as HTMLElement
      if (badge) badge.style.visibility = 'hidden'
    }
  }, [])

  // reCAPTCHA 토큰 발급
  const getRecaptchaToken = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
      if (!siteKey) return resolve('')  // 키 없으면 스킵

      const w = window as unknown as { grecaptcha?: { ready: (cb: () => void) => void; execute: (key: string, opts: { action: string }) => Promise<string> } }
      if (!w.grecaptcha) return resolve('')

      w.grecaptcha.ready(() => {
        w.grecaptcha!.execute(siteKey, { action: 'board_write' })
          .then(resolve)
          .catch(reject)
      })
    })
  }, [])

  useEffect(() => {
    fetch(`/api/board/posts?category=${slug}&limit=1`)
      .then((res) => res.json())
      .then((data) => {
        if (data.category) setCategory(data.category)
      })
  }, [slug])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const recaptchaToken = await getRecaptchaToken()

      const res = await fetch('/api/board/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_slug: slug,
          title: title.trim(),
          content: content.trim(),
          author_type: 'guest',
          guest_nickname: nickname.trim(),
          guest_password: password,
          recaptchaToken,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '글 작성에 실패했습니다')
        setLoading(false)
        return
      }

      router.push(`/board/${slug}/${data.id}`)
    } catch {
      setError('네트워크 오류가 발생했습니다')
      setLoading(false)
    }
  }

  if (category?.admin_only) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-400">관리자만 작성할 수 있는 게시판입니다</p>
        <Link href={`/board/${slug}`} className="text-amber-500 text-sm mt-4 inline-block">
          ← 목록으로
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href={`/board/${slug}`} className="text-sm text-slate-400 hover:text-slate-600">
        ← {category?.name || '게시판'} 목록
      </Link>
      <h1 className="text-2xl font-bold text-slate-700 mt-2 mb-6">✏️ 글쓰기</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-sm">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} autoComplete="off" className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-500 mb-1">닉네임 *</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="2~20자"
              maxLength={20}
              required
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-700 text-sm focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-200"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-500 mb-1">비밀번호 * (숫자 4자리)</label>
                        <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              value={password}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 4)
                setPassword(val)
              }}
              placeholder="••••"
              maxLength={4}
              required
              autoComplete="one-time-code"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-700 text-sm tracking-[0.3em] focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-1">제목 *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="2~100자"
            maxLength={100}
            required
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-200"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-1">
            내용 * ({content.length}/5000)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="5자 이상 입력해주세요"
            maxLength={5000}
            rows={10}
            required
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-700 resize-y focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-200"
          />
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Link
            href={`/board/${slug}`}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-500 text-sm hover:border-slate-400"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-6 py-2 rounded-lg text-sm shadow-sm disabled:opacity-50"
          >
            {loading ? '작성 중...' : '작성하기'}
          </button>
        </div>
          <p className="text-[10px] text-slate-300 text-center pt-2">
          이 사이트는 reCAPTCHA로 보호되며 Google <a href="https://policies.google.com/privacy" className="underline" target="_blank">개인정보처리방침</a>과 <a href="https://policies.google.com/terms" className="underline" target="_blank">이용약관</a>이 적용됩니다.
          </p>
      </form>
    </div>
  )
}