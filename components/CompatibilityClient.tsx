'use client'

import CompatibilityResultView from './CompatibilityResultView'
import { useState, useEffect } from 'react'
import { getLastCalculated, getSavedSajuList, type SavedSajuEntry } from '@/lib/saved-saju'

// ─── 타입 ─────────────────────────────────────────
interface PersonInput {
  name: string
  gender: 'male' | 'female'
  year: number
  month: number
  day: number
  hour: number
  minute: number
  timeOption: 'standard30' | 'none'
  birthTimeUnknown: boolean
}

function defaultPerson(): PersonInput {
  return {
    name: '', gender: 'male', year: 1990, month: 1, day: 1,
    hour: 12, minute: 0, timeOption: 'standard30', birthTimeUnknown: false,
  }
}

function getMaxDay(y: number, m: number): number {
  return new Date(y, m, 0).getDate()
}

// ─── 한 사람 입력 폼 ────────────────────────────────
function PersonForm({
  label, color, person, onChange, savedList,
  showList, onToggleList, onSelectSaved,
}: {
  label: string
  color: 'blue' | 'pink'
  person: PersonInput
  onChange: (p: PersonInput) => void
  savedList: SavedSajuEntry[]
  showList: boolean
  onToggleList: () => void
  onSelectSaved: (entry: SavedSajuEntry) => void
}) {
  const currentYear = new Date().getFullYear()
  const maxDay = getMaxDay(person.year, person.month)
  const up = (partial: Partial<PersonInput>) => onChange({ ...person, ...partial })

  const borderColor = color === 'blue' ? 'border-blue-200' : 'border-pink-200'
  const headerBg = color === 'blue' ? 'bg-blue-50' : 'bg-pink-50'
  const headerText = color === 'blue' ? 'text-blue-700' : 'text-pink-700'

  return (
    <div className={`rounded-2xl border-2 ${borderColor} overflow-hidden`}>
      {/* 헤더 */}
      <div className={`${headerBg} px-5 py-3`}>
        <h3 className={`text-base font-bold ${headerText}`}>
          {color === 'blue' ? '💙' : '💗'} {label}
        </h3>
      </div>

      <div className="p-5 space-y-4 bg-white/80">
        {/* 📋 사주리스트에서 선택 */}
        {savedList.length > 0 && (
          <div>
            <button type="button" onClick={onToggleList}
              className="w-full py-2 px-4 rounded-xl border-2 border-dashed border-indigo-300 text-indigo-600 text-sm font-medium hover:bg-indigo-50 transition">
              📋 사주리스트에서 선택 {showList ? '▲' : '▼'}
            </button>
            {showList && (
              <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto">
                {savedList.map((entry) => (
                  <button key={entry.id} type="button"
                    onClick={() => onSelectSaved(entry)}
                    className="w-full text-left px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 transition">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-700 text-sm">
                        {entry.gender === 'male' ? '👨' : '👩'} {entry.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        {entry.year}-{String(entry.month).padStart(2, '0')}-{String(entry.day).padStart(2, '0')}
                        {!entry.birthTimeUnknown && ` ${String(entry.hour ?? 0).padStart(2, '0')}:${String(entry.minute ?? 0).padStart(2, '0')}`}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 이름 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">이름 (별명)</label>
          <input type="text" value={person.name}
            onChange={(e) => up({ name: e.target.value })}
            placeholder="예: 홍길동" maxLength={20}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-slate-400 text-sm" />
        </div>

        {/* 성별 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">성별</label>
          <div className="flex gap-2">
            <button type="button" onClick={() => up({ gender: 'male' })}
              className={`flex-1 py-2 rounded-xl text-center text-sm font-medium transition ${
                person.gender === 'male'
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-400'
                  : 'bg-slate-100 text-slate-500 border-2 border-transparent hover:bg-slate-200'
              }`}>👨 남성</button>
            <button type="button" onClick={() => up({ gender: 'female' })}
              className={`flex-1 py-2 rounded-xl text-center text-sm font-medium transition ${
                person.gender === 'female'
                  ? 'bg-pink-100 text-pink-700 border-2 border-pink-400'
                  : 'bg-slate-100 text-slate-500 border-2 border-transparent hover:bg-slate-200'
              }`}>👩 여성</button>
          </div>
        </div>

        {/* 생년월일 */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">생년월일 (양력)</label>
          <div className="grid grid-cols-3 gap-1.5">
            <select value={person.year} onChange={(e) => up({ year: Number(e.target.value) })}
              className="w-full px-2 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
              {Array.from({ length: currentYear - 1920 + 1 }, (_, i) => currentYear - i).map(y => (
                <option key={y} value={y}>{y}년</option>
              ))}
            </select>
            <select value={person.month} onChange={(e) => up({ month: Number(e.target.value) })}
              className="w-full px-2 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>{m}월</option>
              ))}
            </select>
            <select value={Math.min(person.day, maxDay)} onChange={(e) => up({ day: Number(e.target.value) })}
              className="w-full px-2 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
              {Array.from({ length: maxDay }, (_, i) => i + 1).map(d => (
                <option key={d} value={d}>{d}일</option>
              ))}
            </select>
          </div>
        </div>

        {/* 출생시간 */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-slate-700">출생시간</label>
            <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
              <input type="checkbox" checked={person.birthTimeUnknown}
                onChange={(e) => up({ birthTimeUnknown: e.target.checked })} className="rounded" />
              시간 모름
            </label>
          </div>
          {!person.birthTimeUnknown && (
            <div className="grid grid-cols-2 gap-1.5">
              <select value={person.hour} onChange={(e) => up({ hour: Number(e.target.value) })}
                className="w-full px-2 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                {Array.from({ length: 24 }, (_, i) => i).map(h => (
                  <option key={h} value={h}>{String(h).padStart(2, '0')}시</option>
                ))}
              </select>
              <select value={person.minute} onChange={(e) => up({ minute: Number(e.target.value) })}
                className="w-full px-2 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                {Array.from({ length: 12 }, (_, i) => i * 5).map(m => (
                  <option key={m} value={m}>{String(m).padStart(2, '0')}분</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* 시간 보정 */}
        {!person.birthTimeUnknown && (
          <div>
            <div className="flex gap-2">
              <label className={`flex-1 py-1.5 px-2 rounded-xl text-center text-xs cursor-pointer transition ${
                person.timeOption === 'standard30'
                  ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-400'
                  : 'bg-slate-100 text-slate-500 border-2 border-transparent hover:bg-slate-200'
              }`}>
                <input type="radio" value="standard30"
                  checked={person.timeOption === 'standard30'}
                  onChange={() => up({ timeOption: 'standard30' })} className="sr-only" />
                30분 보정
              </label>
              <label className={`flex-1 py-1.5 px-2 rounded-xl text-center text-xs cursor-pointer transition ${
                person.timeOption === 'none'
                  ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-400'
                  : 'bg-slate-100 text-slate-500 border-2 border-transparent hover:bg-slate-200'
              }`}>
                <input type="radio" value="none"
                  checked={person.timeOption === 'none'}
                  onChange={() => up({ timeOption: 'none' })} className="sr-only" />
                보정 없음
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── 메인 컴포넌트 ──────────────────────────────────
export default function CompatibilityClient() {
  const [person1, setPerson1] = useState<PersonInput>(defaultPerson())
  const [person2, setPerson2] = useState<PersonInput>(defaultPerson())
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showList1, setShowList1] = useState(false)
  const [showList2, setShowList2] = useState(false)
  const [savedList, setSavedList] = useState<SavedSajuEntry[]>([])

  // 초기화: Person1 자동채우기 + 사주리스트 로드
  useEffect(() => {
    const last = getLastCalculated()
    if (last) {
      setPerson1({
        name: last.name || '',
        gender: last.gender,
        year: last.year, month: last.month, day: last.day,
        hour: last.hour ?? 12, minute: last.minute ?? 0,
        timeOption: last.timeOption,
        birthTimeUnknown: last.birthTimeUnknown,
      })
    }
    setSavedList(getSavedSajuList())
  }, [])

  // 사주리스트에서 선택
  function selectSaved(num: 1 | 2, entry: SavedSajuEntry) {
    const data: PersonInput = {
      name: entry.name, gender: entry.gender,
      year: entry.year, month: entry.month, day: entry.day,
      hour: entry.hour ?? 12, minute: entry.minute ?? 0,
      timeOption: entry.timeOption, birthTimeUnknown: entry.birthTimeUnknown,
    }
    if (num === 1) { setPerson1(data); setShowList1(false) }
    else { setPerson2(data); setShowList2(false) }
  }

  // API 호출
  async function handleSubmit() {
    if (!person1.name.trim()) { alert('첫 번째 사람의 이름을 입력해주세요.'); return }
    if (!person2.name.trim()) { alert('두 번째 사람의 이름을 입력해주세요.'); return }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const buildBody = (p: PersonInput) => ({
        name: p.name.trim(), gender: p.gender,
        year: p.year, month: p.month, day: Math.min(p.day, getMaxDay(p.year, p.month)),
        hour: p.birthTimeUnknown ? null : p.hour,
        minute: p.birthTimeUnknown ? null : p.minute,
        timeOption: p.timeOption, birthTimeUnknown: p.birthTimeUnknown,
      })

      const res = await fetch('/api/saju/compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ person1: buildBody(person1), person2: buildBody(person2) }),
      })

      const data = await res.json()
      if (!res.ok) { setError(data.error || '궁합 분석 중 오류가 발생했습니다.'); return }
      setResult(data)
    } catch {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">💕 궁합 분석</h1>
        <p className="text-slate-500">두 사람의 사주로 궁합을 알아보세요</p>
      </div>

      {/* 두 사람 입력 */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <PersonForm label="첫 번째 사람" color="blue"
          person={person1} onChange={setPerson1} savedList={savedList}
          showList={showList1}
          onToggleList={() => { setShowList1(!showList1); setShowList2(false) }}
          onSelectSaved={(e) => selectSaved(1, e)} />
        <PersonForm label="두 번째 사람" color="pink"
          person={person2} onChange={setPerson2} savedList={savedList}
          showList={showList2}
          onToggleList={() => { setShowList2(!showList2); setShowList1(false) }}
          onSelectSaved={(e) => selectSaved(2, e)} />
      </div>

      {/* 제출 버튼 */}
      <button onClick={handleSubmit} disabled={isLoading}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-bold text-lg hover:from-pink-600 hover:to-indigo-600 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed transition shadow-lg">
        {isLoading ? '분석 중...' : '💕 궁합 보기'}
      </button>

      {/* 에러 */}
      {error && (
        <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* 궁합 결과 */}
      {result && <CompatibilityResultView result={result} />}
    </div>
  )
}