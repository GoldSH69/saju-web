'use client'

import { useState, useEffect } from 'react'
import { migrateOldSavedData } from '@/lib/saved-saju'

interface SajuFormData {
  name: string
  year: number
  month: number
  day: number
  hour: number | null
  minute: number | null
  gender: 'male' | 'female'
  timeOption: 'standard30' | 'none'
  birthTimeUnknown: boolean
}

interface SajuFormProps {
  onSubmit: (data: SajuFormData) => void
  isLoading: boolean
  /** 외부에서 폼 값을 채울 때 사용 (사주리스트 클릭 시) */
  initialData?: {
    name?: string
    year: number
    month: number
    day: number
    hour: number | null
    minute: number | null
    gender: 'male' | 'female'
    timeOption: 'standard30' | 'none'
    birthTimeUnknown: boolean
  }
}

export default function SajuForm({ onSubmit, isLoading, initialData }: SajuFormProps) {
  const currentYear = new Date().getFullYear()

  const [name, setName] = useState(initialData?.name ?? '')
  const [year, setYear] = useState(initialData?.year ?? 1990)
  const [month, setMonth] = useState(initialData?.month ?? 1)
  const [day, setDay] = useState(initialData?.day ?? 1)
  const [hour, setHour] = useState(initialData?.hour ?? 12)
  const [minute, setMinute] = useState(initialData?.minute ?? 0)
  const [gender, setGender] = useState<'male' | 'female'>(initialData?.gender ?? 'male')
  const [timeOption, setTimeOption] = useState<'standard30' | 'none'>(initialData?.timeOption ?? 'standard30')
  const [birthTimeUnknown, setBirthTimeUnknown] = useState(initialData?.birthTimeUnknown ?? false)

  // ─── 기존 1명 데이터 → 새 리스트로 마이그레이션 ──────
  useEffect(() => {
    migrateOldSavedData()
  }, [])

  // ─── initialData 변경 시 폼 갱신 (리스트 클릭 시) ────
  useEffect(() => {
    if (initialData) {
      setName(initialData.name ?? '')
      setYear(initialData.year)
      setMonth(initialData.month)
      setDay(initialData.day)
      setHour(initialData.hour ?? 12)
      setMinute(initialData.minute ?? 0)
      setGender(initialData.gender)
      setTimeOption(initialData.timeOption)
      setBirthTimeUnknown(initialData.birthTimeUnknown)
    }
  }, [initialData])

  // ─── 제출 ──────────────────────────────────────────────
  function getMaxDay(y: number, m: number): number {
    return new Date(y, m, 0).getDate()
  }

  const maxDay = getMaxDay(year, month)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim()) {
      alert('이름(별명)을 입력해주세요.')
      return
    }

    const formData: SajuFormData = {
      name: name.trim(),
      year,
      month,
      day: Math.min(day, maxDay),
      hour: birthTimeUnknown ? null : hour,
      minute: birthTimeUnknown ? null : minute,
      gender,
      timeOption,
      birthTimeUnknown,
    }

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 이름(별명) */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">이름 (별명)</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 홍길동, 나, 엄마"
          maxLength={20}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-slate-400"
          required
        />
        <p className="text-xs text-slate-400 mt-1">* 필수 입력 — 사주리스트 저장 시 이름으로 사용됩니다</p>
      </div>

      {/* 성별 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">성별</label>
        <div className="flex gap-3">
          <button type="button" onClick={() => setGender('male')}
            className={`flex-1 py-3 rounded-xl text-center font-medium transition ${gender === 'male' ? 'bg-blue-100 text-blue-700 border-2 border-blue-400' : 'bg-slate-100 text-slate-500 border-2 border-transparent hover:bg-slate-200'}`}>
            👨 남성
          </button>
          <button type="button" onClick={() => setGender('female')}
            className={`flex-1 py-3 rounded-xl text-center font-medium transition ${gender === 'female' ? 'bg-pink-100 text-pink-700 border-2 border-pink-400' : 'bg-slate-100 text-slate-500 border-2 border-transparent hover:bg-slate-200'}`}>
            👩 여성
          </button>
        </div>
      </div>

      {/* 생년월일 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">생년월일 (양력)</label>
        <div className="grid grid-cols-3 gap-2">
          <select value={year} onChange={(e) => setYear(Number(e.target.value))}
            className="w-full px-3 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400">
            {Array.from({ length: currentYear - 1920 + 1 }, (_, i) => currentYear - i).map(y => (
              <option key={y} value={y}>{y}년</option>
            ))}
          </select>
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))}
            className="w-full px-3 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400">
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>{m}월</option>
            ))}
          </select>
          <select value={Math.min(day, maxDay)} onChange={(e) => setDay(Number(e.target.value))}
            className="w-full px-3 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400">
            {Array.from({ length: maxDay }, (_, i) => i + 1).map(d => (
              <option key={d} value={d}>{d}일</option>
            ))}
          </select>
        </div>
      </div>

      {/* 출생시간 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-slate-700">출생시간</label>
          <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer">
            <input type="checkbox" checked={birthTimeUnknown} onChange={(e) => setBirthTimeUnknown(e.target.checked)} className="rounded" />
            시간 모름
          </label>
        </div>
        {!birthTimeUnknown && (
          <div className="grid grid-cols-2 gap-2">
            <select value={hour} onChange={(e) => setHour(Number(e.target.value))}
              className="w-full px-3 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400">
              {Array.from({ length: 24 }, (_, i) => i).map(h => (
                <option key={h} value={h}>{String(h).padStart(2, '0')}시</option>
              ))}
            </select>
            <select value={minute} onChange={(e) => setMinute(Number(e.target.value))}
              className="w-full px-3 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400">
              {Array.from({ length: 12 }, (_, i) => i * 5).map(m => (
                <option key={m} value={m}>{String(m).padStart(2, '0')}분</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 시간 보정 */}
      {!birthTimeUnknown && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">시간 보정</label>
          <div className="flex gap-3">
            <label className={`flex-1 py-2 px-3 rounded-xl text-center text-sm cursor-pointer transition ${timeOption === 'standard30' ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-400' : 'bg-slate-100 text-slate-500 border-2 border-transparent hover:bg-slate-200'}`}>
              <input type="radio" name="timeOption" value="standard30" checked={timeOption === 'standard30'} onChange={() => setTimeOption('standard30')} className="sr-only" />
              30분 보정 (권장)
            </label>
            <label className={`flex-1 py-2 px-3 rounded-xl text-center text-sm cursor-pointer transition ${timeOption === 'none' ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-400' : 'bg-slate-100 text-slate-500 border-2 border-transparent hover:bg-slate-200'}`}>
              <input type="radio" name="timeOption" value="none" checked={timeOption === 'none'} onChange={() => setTimeOption('none')} className="sr-only" />
              보정 없음
            </label>
          </div>
          <p className="text-xs text-slate-400 mt-1">한국 표준시(동경 135°)와 실제 경도(127.5°) 차이 30분 보정</p>
        </div>
      )}

      {/* 제출 버튼 */}
      <button type="submit" disabled={isLoading}
        className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition">
        {isLoading ? '계산 중...' : '🔮 사주 보기'}
      </button>
    </form>
  )
}