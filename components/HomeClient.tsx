'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import SajuForm from '@/components/SajuForm'
import SajuResult from '@/components/SajuResult'
import {
  getSajuEntryById,
  saveSajuEntry,
  isSavedFull,
  updateLastViewed,
  getLastCalculated,
  saveLastCalculated,
} from '@/lib/saved-saju'

export default function HomeClient() {
  const searchParams = useSearchParams()
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 폼에 채울 초기값
  const [initialData, setInitialData] = useState<any>(undefined)
  // 마지막 제출한 폼 데이터 (저장용)
  const [lastFormData, setLastFormData] = useState<any>(null)
  // 현재 로드된 저장 ID
  const [loadedEntryId, setLoadedEntryId] = useState<string | null>(null)
  // 저장 다이얼로그
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  // 초기 로드 완료 여부
  const [loaded, setLoaded] = useState(false)
  // 자동 계산 중복 방지
  const autoCalcDone = useRef(false)

  // ─── 페이지 로드 시 데이터 복원 ────────────────────
  useEffect(() => {
    const id = searchParams.get('id')

    if (id) {
      // 사주리스트에서 클릭 → 자동 계산
      const entry = getSajuEntryById(id)
      if (entry) {
        const data = {
          name: entry.name,
          year: entry.year,
          month: entry.month,
          day: entry.day,
          hour: entry.hour,
          minute: entry.minute,
          gender: entry.gender,
          timeOption: entry.timeOption,
          birthTimeUnknown: entry.birthTimeUnknown,
        }
        setInitialData(data)
        setLoadedEntryId(id)
        updateLastViewed(id)
        if (!autoCalcDone.current) {
          autoCalcDone.current = true
          doCalculate(data)
        }
      }
    } else {
      // 일반 방문 → 입력값만 폼에 채움 (자동 계산 안 함)
      const last = getLastCalculated()
      if (last) {
        setInitialData(last)
      }
    }

    setLoaded(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  // ─── 사주 계산 ─────────────────────────────────────
  async function doCalculate(data: any) {
    setIsLoading(true)
    setError(null)
    setResult(null)
    setLastFormData(data)
    setSaveMessage(null)

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

      // 마지막 계산 데이터 자동 저장 (이름 포함)
      saveLastCalculated({
        name: data.name || '',
        year: data.year,
        month: data.month,
        day: data.day,
        hour: data.hour ?? null,
        minute: data.minute ?? null,
        gender: data.gender,
        timeOption: data.timeOption || 'standard30',
        birthTimeUnknown: data.birthTimeUnknown || false,
      })

      // 저장된 사주에서 로드한 경우 조회 시간 갱신
      if (loadedEntryId) {
        updateLastViewed(loadedEntryId)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  function handleSubmit(data: any) {
    autoCalcDone.current = true
    doCalculate(data)
  }

  // ─── 저장하기 ──────────────────────────────────────
  function handleSave() {
    if (!lastFormData) return

    if (isSavedFull()) {
      setSaveMessage('⚠️ 저장 공간이 가득 찼습니다 (최대 10명). 사주리스트에서 삭제 후 저장해주세요.')
      return
    }

    // 폼의 이름으로 미리 채움
    setSaveName(lastFormData.name || '')
    setShowSaveDialog(true)
  }

  function confirmSave() {
    if (!saveName.trim()) {
      setSaveMessage('⚠️ 이름(별명)을 입력해주세요.')
      return
    }
    if (!lastFormData) return

    const entry = saveSajuEntry({
      name: saveName.trim(),
      gender: lastFormData.gender,
      year: lastFormData.year,
      month: lastFormData.month,
      day: lastFormData.day,
      hour: lastFormData.hour,
      minute: lastFormData.minute,
      timeOption: lastFormData.timeOption,
      birthTimeUnknown: lastFormData.birthTimeUnknown,
    })

    if (entry) {
      setLoadedEntryId(entry.id)
      setSaveMessage(`✅ "${saveName.trim()}" 저장 완료!`)
    } else {
      setSaveMessage('⚠️ 저장 공간이 가득 찼습니다.')
    }

    setShowSaveDialog(false)
  }

  // ─── 표시용 헬퍼 ──────────────────────────────────
  function getBirthLabel(): string {
    if (!lastFormData) return ''
    const { year, month, day, hour, minute, birthTimeUnknown } = lastFormData
    const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    if (birthTimeUnknown) return `${date} (시간 모름)`
    return `${date} ${String(hour ?? 0).padStart(2, '0')}:${String(minute ?? 0).padStart(2, '0')}`
  }

  if (!loaded) return null

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-center text-xl font-bold text-slate-700 py-4">
        만세력 기반 무료 사주 분석
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <SajuForm onSubmit={handleSubmit} isLoading={isLoading} initialData={initialData} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-600">❌ {error}</p>
        </div>
      )}

      {/* 결과 헤더 + 저장 버튼 */}
      {result && lastFormData && (
        <div className="mb-4">
          {/* 이름 + 생년월일 표시 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{lastFormData.gender === 'male' ? '👨' : '👩'}</span>
              <span className="font-bold text-slate-800 text-lg">{lastFormData.name}</span>
              <span className="text-sm text-slate-500">({getBirthLabel()})</span>
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition"
            >
              💾 사주리스트에 저장
            </button>
            {saveMessage && (
              <span className="text-sm">{saveMessage}</span>
            )}
          </div>

          {/* 저장 다이얼로그 */}
          {showSaveDialog && (
            <div className="mt-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                저장할 이름을 확인하세요
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && confirmSave()}
                  placeholder="예: 나, 엄마, 친구"
                  maxLength={20}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  autoFocus
                />
                <button
                  onClick={confirmSave}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                >
                  저장
                </button>
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition"
                >
                  취소
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {result && <SajuResult result={result} />}
    </div>
  )
}