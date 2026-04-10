'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { getLastCalculated } from '@/lib/saved-saju'

// ─── 줄바꿈 텍스트 렌더링 ───────────────────────────────
function TextWithLineBreaks({ text, className }: { text: string; className?: string }) {
  const paragraphs = text.split('\n\n')
  return (
    <div className={className}>
      {paragraphs.map((para, i) => {
        const lines = para.split('\n')
        return (
          <p key={i} className={i > 0 ? 'mt-3' : ''}>
            {lines.map((line, j) => (
              <span key={j}>
                {j > 0 && <br />}
                {line}
              </span>
            ))}
          </p>
        )
      })}
    </div>
  )
}

// ─── 별점 렌더링 ────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center justify-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`text-xl ${i < Math.max(1, Math.min(5, rating)) ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
      ))}
    </div>
  )
}

// ─── 생년월일 표시 헬퍼 ─────────────────────────────────
function formatBirthLabel(data: {
  year: number; month: number; day: number;
  hour: number | null; minute: number | null;
  birthTimeUnknown: boolean;
}): string {
  const date = `${data.year}-${String(data.month).padStart(2, '0')}-${String(data.day).padStart(2, '0')}`
  if (data.birthTimeUnknown) return `${date} (시간 모름)`
  return `${date} ${String(data.hour ?? 0).padStart(2, '0')}:${String(data.minute ?? 0).padStart(2, '0')}`
}

export default function FortuneClient() {
  const today = new Date()
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][today.getDay()]
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth() + 1

  // ─── 결과 상태 ────────────────────────────────────────
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  // ─── 사용자 정보 (헤더 표시용) ────────────────────────
  const [userName, setUserName] = useState('')
  const [userBirth, setUserBirth] = useState('')
  const [userGender, setUserGender] = useState<'male' | 'female'>('male')

  // ─── 잠금 상태 (일/월/세 각각) ────────────────────────
  const [dailyUnlocked, setDailyUnlocked] = useState(false)
  const [monthlyUnlocked, setMonthlyUnlocked] = useState(false)
  const [yearlyUnlocked, setYearlyUnlocked] = useState(false)

  // 자동 계산 중복 방지
  const autoCalcDone = useRef(false)

  // ─── 마지막 계산 데이터 로드 + 자동 계산 ──────────────
  useEffect(() => {
    const last = getLastCalculated()

    // name이 있을 때만 자동 계산
    if (last && last.name) {
      setUserName(last.name)
      setUserGender(last.gender)
      setUserBirth(formatBirthLabel(last))

      if (!autoCalcDone.current) {
        autoCalcDone.current = true
        doCalculate({
          year: last.year,
          month: last.month,
          day: last.day,
          hour: last.birthTimeUnknown ? null : last.hour,
          minute: last.birthTimeUnknown ? null : last.minute,
          gender: last.gender,
          timeOption: last.timeOption || 'standard30',
          birthTimeUnknown: last.birthTimeUnknown,
        })
      }
    }
    setLoaded(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ─── API 호출 ─────────────────────────────────────────
  async function doCalculate(formData: any) {
    setIsLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/saju/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || '계산 실패')
      }
      setResult(await res.json())
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!loaded) return null

  const interp = result?.interpretation
  const df = interp?.dailyFortune
  const mf = interp?.monthlyFortune
  const yf = interp?.yearlyFortune
  const dailyFortune = result?.fortune?.daily?.fortune
  const monthlyFortune = result?.fortune?.monthly
  const yearlyFortune = result?.fortune?.yearly
  const dayStem = result?.dayStem

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">

      {/* ── 헤더 ── */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">🔮 종합 운세</h1>
        <p className="text-sm text-slate-500">{dateStr} ({dayOfWeek}요일)</p>
      </div>

      {/* ── 사주 데이터 없을 때 안내 ── */}
      {!userName && !isLoading && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <p className="text-4xl mb-4">🔮</p>
          <p className="text-slate-700 font-medium mb-2">먼저 사주를 계산해주세요</p>
          <p className="text-sm text-slate-500 mb-6">
            홈에서 이름과 생년월일시를 입력하면<br />
            오늘·이번달·올해 운세를 확인할 수 있습니다.
          </p>
          <Link href="/"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition">
            🔮 사주 계산하러 가기
          </Link>
        </div>
      )}

      {/* ── 로딩 ── */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3"></div>
          <p className="text-sm text-slate-500">운세를 계산하고 있습니다...</p>
        </div>
      )}

      {/* ── 에러 ── */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-red-600 text-sm">❌ {error}</p>
        </div>
      )}

      {/* ── 결과 ── */}
      {result && dayStem && (
        <div className="space-y-4">

          {/* 사용자 정보 + 기본 사주 정보 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-lg">{userGender === 'male' ? '👨' : '👩'}</span>
              <span className="font-bold text-slate-800 text-lg">{userName}</span>
              <span className="text-sm text-slate-500">({userBirth})</span>
            </div>
            <p className="text-xs text-slate-400 mb-1">
              일간: {dayStem.char}({dayStem.name}) · {dayStem.elementKo}/{dayStem.yinYangKo === '양' ? '양(陽)' : '음(陰)'}
            </p>
            <div className="flex justify-center gap-4 text-xs text-slate-400">
              {dailyFortune && (
                <span>일운: <span className="text-indigo-500 font-medium">{dailyFortune.ganjiChar}</span> {df?.star}</span>
              )}
              {monthlyFortune && (
                <span>월운: <span className="text-indigo-500 font-medium">{monthlyFortune.fortune.ganjiChar}</span> {mf?.star}</span>
              )}
              {yearlyFortune && (
                <span>세운: <span className="text-indigo-500 font-medium">{yearlyFortune.fortune.ganjiChar}</span> {yf?.star}</span>
              )}
            </div>
          </div>

          {/* ━━━ ① 오늘의 운세 ━━━ */}
          {df && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-5 text-center">
                  <p className="text-xs text-slate-400 mb-2">📅 오늘의 운세</p>
                  <StarRating rating={df.rating} />
                  <h2 className="text-lg font-bold text-slate-800 mt-2 mb-2">{df.theme}</h2>
                  <p className="text-sm text-slate-700 leading-relaxed">{df.short}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 p-5">
                {dailyUnlocked ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-700 mb-2">📖 상세 운세</h3>
                      <div className="bg-slate-50 rounded-xl p-4">
                        <TextWithLineBreaks text={df.detail} className="text-sm text-slate-600 leading-relaxed" />
                      </div>
                    </div>
                    <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
                      <div className="text-sm font-bold text-indigo-700 mb-1">💡 오늘의 조언</div>
                      <p className="text-sm text-slate-600">{df.advice}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-700 mb-2">🍀 행운 정보</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { icon: '🎨', label: '행운의 색', value: df.lucky.color },
                          { icon: '🧭', label: '행운의 방향', value: df.lucky.direction },
                          { icon: '🔢', label: '행운의 숫자', value: df.lucky.number },
                          { icon: '⏰', label: '행운의 시간', value: df.lucky.time },
                        ].map((item, i) => (
                          <div key={i} className="bg-slate-50 rounded-xl p-3 text-center">
                            <div className="text-xs text-slate-400 mb-1">{item.icon} {item.label}</div>
                            <div className="text-sm font-bold text-slate-700">{item.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                      <div className="text-sm font-bold text-red-600 mb-1">⚠️ 주의사항</div>
                      <p className="text-sm text-slate-600">{df.caution}</p>
                    </div>
                  </div>
                ) : (
                  <BlurOverlay
                    previewText={df.detail.substring(0, 80)}
                    label="상세 운세 + 행운 정보 + 조언"
                    onUnlock={() => setDailyUnlocked(true)}
                  />
                )}
              </div>
            </div>
          )}

          {/* ━━━ ② 이번달 운세 ━━━ */}
          {mf && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 text-center">
                  <p className="text-xs text-slate-400 mb-2">📅 {currentYear}년 {currentMonth}월 운세</p>
                  <StarRating rating={mf.rating} />
                  <h2 className="text-lg font-bold text-slate-800 mt-2 mb-2">{mf.theme}</h2>
                  <p className="text-sm text-slate-700 leading-relaxed">{mf.short}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 p-5">
                {monthlyUnlocked ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-700 mb-2">📖 이번달 상세 운세</h3>
                      <div className="bg-slate-50 rounded-xl p-4">
                        <TextWithLineBreaks text={mf.detail} className="text-sm text-slate-600 leading-relaxed" />
                      </div>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                      <div className="text-sm font-bold text-emerald-700 mb-1">💡 이번달 조언</div>
                      <p className="text-sm text-slate-600">{mf.advice}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-700 mb-2">🎯 분야별 집중 포인트</h3>
                      <div className="space-y-2">
                        {[
                          { icon: '💼', label: '직업/사업', value: mf.focus.career },
                          { icon: '❤️', label: '대인관계', value: mf.focus.relationship },
                          { icon: '💪', label: '건강', value: mf.focus.health },
                          { icon: '💰', label: '재물', value: mf.focus.wealth },
                        ].map((item, i) => (
                          <div key={i} className="bg-slate-50 rounded-xl p-3">
                            <span className="text-sm font-medium text-slate-700">{item.icon} {item.label}: </span>
                            <span className="text-sm text-slate-600">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                      <div className="text-sm font-bold text-red-600 mb-1">⚠️ 주의사항</div>
                      <p className="text-sm text-slate-600">{mf.caution}</p>
                    </div>
                  </div>
                ) : (
                  <BlurOverlay
                    previewText={mf.detail.substring(0, 80)}
                    label="상세 월운 + 분야별 포인트 + 조언"
                    onUnlock={() => setMonthlyUnlocked(true)}
                  />
                )}
              </div>
            </div>
          )}

          {/* ━━━ ③ 올해의 운세 ━━━ */}
          {yf && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 text-center">
                  <p className="text-xs text-slate-400 mb-2">📅 {currentYear}년 운세</p>
                  <StarRating rating={yf.rating} />
                  <h2 className="text-lg font-bold text-slate-800 mt-2 mb-2">{yf.theme}</h2>
                  <p className="text-sm text-slate-700 leading-relaxed">{yf.short}</p>
                  <div className="flex justify-center gap-2 mt-3">
                    {yf.keywords.map((kw: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 bg-white/70 rounded-full text-xs font-medium text-amber-700 border border-amber-200">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 p-5">
                {yearlyUnlocked ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-700 mb-2">📖 올해 상세 운세</h3>
                      <div className="bg-slate-50 rounded-xl p-4">
                        <TextWithLineBreaks text={yf.detail} className="text-sm text-slate-600 leading-relaxed" />
                      </div>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                      <div className="text-sm font-bold text-amber-700 mb-1">💡 올해의 조언</div>
                      <p className="text-sm text-slate-600">{yf.advice}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-700 mb-2">🔭 분야별 전망</h3>
                      <div className="space-y-2">
                        {[
                          { icon: '💼', label: '직업/사업', value: yf.outlook.career },
                          { icon: '❤️', label: '대인관계', value: yf.outlook.relationship },
                          { icon: '💪', label: '건강', value: yf.outlook.health },
                          { icon: '💰', label: '재물', value: yf.outlook.wealth },
                        ].map((item, i) => (
                          <div key={i} className="bg-slate-50 rounded-xl p-3">
                            <span className="text-sm font-medium text-slate-700">{item.icon} {item.label}: </span>
                            <span className="text-sm text-slate-600">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                      <div className="text-sm font-bold text-red-600 mb-1">⚠️ 주의사항</div>
                      <p className="text-sm text-slate-600">{yf.caution}</p>
                    </div>
                  </div>
                ) : (
                  <BlurOverlay
                    previewText={yf.detail.substring(0, 80)}
                    label="상세 세운 + 분야별 전망 + 조언"
                    onUnlock={() => setYearlyUnlocked(true)}
                  />
                )}
              </div>
            </div>
          )}

          {/* 하단 안내 */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-400">매일 바뀌는 일운으로 운세가 달라집니다. 내일도 확인하세요!</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Blur 오버레이 공통 컴포넌트 ─────────────────────────
function BlurOverlay({
  previewText,
  label,
  onUnlock,
}: {
  previewText: string
  label: string
  onUnlock: () => void
}) {
  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none select-none opacity-60 max-h-32 overflow-hidden">
        <div className="bg-slate-50 rounded-xl p-4 mb-3">
          <p className="text-sm text-slate-600">{previewText}...</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="text-xs text-slate-400">💼 직업/사업</div>
            <div className="text-sm font-bold">???</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="text-xs text-slate-400">💰 재물</div>
            <div className="text-sm font-bold">???</div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 to-white flex flex-col items-center justify-end pb-4">
        <p className="text-xs text-slate-500 mb-2">🔒 {label}</p>
        <button onClick={onUnlock}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-bold hover:bg-indigo-700 transition shadow-lg">
          🔓 광고 보고 전체 내용 확인
        </button>
      </div>
    </div>
  )
}