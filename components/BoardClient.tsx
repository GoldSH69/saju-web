'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Category {
  id: string
  slug: string
  name: string
  description: string | null
  allow_guest: boolean
  admin_only: boolean
  post_count: number
}

export default function BoardClient() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/board/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center text-slate-700 mb-8">📋 게시판</h1>

      {loading ? (
        <p className="text-center text-slate-400">불러오는 중...</p>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/board/${cat.slug}`}
              className="block bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-amber-400 hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-700">
                    {cat.name}
                    {cat.admin_only && (
                      <span className="ml-2 text-xs text-amber-500 font-normal">관리자</span>
                    )}
                  </h2>
                  {cat.description && (
                    <p className="text-sm text-slate-400 mt-1">{cat.description}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-sm text-slate-400">{cat.post_count}개</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}