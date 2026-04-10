'use client'

import { useState } from 'react'
import SajuForm from '@/components/SajuForm'
import SajuResult from '@/components/SajuResult'

export default function HomeClient() {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(data: any) {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/saju/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || '계산 실패')
      }

      const json = await res.json()
      setResult(json)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-center text-xl font-bold text-slate-700 py-4">
        만세력 기반 사주 분석 및 오늘의 운세
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <SajuForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-600">❌ {error}</p>
        </div>
      )}

      {result && <SajuResult result={result} />}
    </div>
  )
}