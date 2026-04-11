'use client'

import { useState } from 'react'

// ─── 상수 ──────────────────────────────────────────

const ELEMENT_COLORS: Record<string, string> = {
  '木': 'text-green-700', '火': 'text-red-600', '土': 'text-yellow-700',
  '金': 'text-gray-600', '水': 'text-blue-700',
}

// 엔진 grade: '천생연분'|'좋은 궁합'|'보통'|'노력 필요'|'주의 필요'
const GRADE_CONFIG: Record<string, { emoji: string; color: string; bg: string; border: string }> = {
  '천생연분': { emoji: '💘', color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-200' },
  '좋은 궁합': { emoji: '💕', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  '보통': { emoji: '💛', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  '노력 필요': { emoji: '🧡', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  '주의 필요': { emoji: '⚠️', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
}

const ITEM_ICONS: Record<string, string> = {
  '일간 오행 궁합': '☯️', '용신 보완': '⚖️', '십성 궁합': '⭐',
  '일지 궁합': '🏠', '오행 균형 보완': '🎯',
}

function barColor(pct: number): string {
  if (pct >= 80) return 'bg-indigo-500'
  if (pct >= 60) return 'bg-blue-500'
  if (pct >= 40) return 'bg-emerald-500'
  if (pct >= 20) return 'bg-amber-500'
  return 'bg-red-500'
}

// 엔진 itemGrade: 'A'|'B'|'C'|'D'|'F'
function gradeColor(grade: string): string {
  if (grade === 'A') return 'text-indigo-600'
  if (grade === 'B') return 'text-blue-600'
  if (grade === 'C') return 'text-emerald-600'
  if (grade === 'D') return 'text-amber-600'
  return 'text-red-600'
}

function gradeLabel(grade: string): string {
  if (grade === 'A') return '매우좋음'
  if (grade === 'B') return '좋음'
  if (grade === 'C') return '보통'
  if (grade === 'D') return '부족'
  return '주의'
}

const pillarLabels: Record<string, string> = { hour: '시', day: '일', month: '월', year: '년' }

// ─── 메인 컴포넌트 ─────────────────────────────────

export default function CompatibilityResultView({ result }: { result: any }) {
  const [detailUnlocked, setDetailUnlocked] = useState(false)

  const c = result.compatibility
  const p1 = result.person1Summary
  const p2 = result.person2Summary
  const gradeStyle = GRADE_CONFIG[c.grade] || GRADE_CONFIG['보통']

  const name1 = c.person1.name || p1.name || '사람1'
  const name2 = c.person2.name || p2.name || '사람2'

  const items = [
    c.items.dayElement, c.items.yongsinComplement, c.items.tenStar,
    c.items.dayBranch, c.items.elementBalance,
  ]

  return (
    <div className="mt-8 space-y-6">

      {/* ═══════════ 무료 영역 ═══════════ */}

      {/* ── 종합 점수 ── */}
      <div className={`rounded-2xl border-2 ${gradeStyle.border} ${gradeStyle.bg} p-6 text-center`}>
        <p className="text-lg font-bold text-slate-700 mb-3">
          {name1} {gradeStyle.emoji} {name2}
        </p>
        <div className={`text-6xl font-black ${gradeStyle.color} mb-1`}>
          {c.totalScore}<span className="text-2xl font-medium">점</span>
        </div>
        <p className={`text-xl font-bold ${gradeStyle.color} mb-3`}>{c.grade}</p>
        <p className="text-sm text-slate-500">{c.summary}</p>
      </div>

      {/* ── 일간 비교 ── */}
      <div className="bg-white/80 rounded-2xl border border-slate-200 p-5">
        <h3 className="text-sm font-bold text-slate-500 mb-4 text-center">일간(日干) 비교</h3>
        <div className="flex items-center justify-center gap-6">
          {[{ p: c.person1, n: name1 }, { p: c.person2, n: name2 }].map(({ p, n }, idx) => (
            <div key={idx} className="text-center">
              <div className={`text-4xl font-black ${ELEMENT_COLORS[p.dayElementKo] || 'text-slate-700'}`}>
                {p.dayStem}
              </div>
              <p className="text-sm text-slate-600 mt-1">{p.dayStemName}({p.dayElementKo})</p>
              <p className="text-xs text-slate-400">{n}</p>
            </div>
          )).reduce((acc: any[], el, idx) => {
            if (idx === 1) acc.push(
              <div key="heart" className="text-2xl text-pink-400">❤️</div>
            )
            acc.push(el)
            return acc
          }, [])}
        </div>
      </div>

      {/* ── 사주 원국 비교 ── */}
      <div className="bg-white/80 rounded-2xl border border-slate-200 p-5">
        <h3 className="text-sm font-bold text-slate-500 mb-4 text-center">사주 원국 비교</h3>
        <div className="grid grid-cols-2 gap-4">
          {[{ label: name1, pillars: p1.fourPillars }, { label: name2, pillars: p2.fourPillars }].map(
            ({ label, pillars }, idx) => (
              <div key={idx} className="text-center">
                <p className="text-sm font-medium text-slate-600 mb-2">{label}</p>
                <div className="flex justify-center gap-1.5">
                  {(['hour', 'day', 'month', 'year'] as const).map((key) => {
                    const pl = pillars[key]
                    if (!pl) return (
                      <div key={key} className="w-10 text-center">
                        <div className="text-[10px] text-slate-400 mb-0.5">시</div>
                        <div className="text-lg text-slate-300">?</div>
                        <div className="text-lg text-slate-300">?</div>
                      </div>
                    )
                    return (
                      <div key={key} className="w-10 text-center">
                        <div className="text-[10px] text-slate-400 mb-0.5">{pillarLabels[key]}</div>
                        <div className={`text-lg font-bold ${ELEMENT_COLORS[pl.stem.elementKo] || 'text-slate-700'}`}>
                          {pl.stem.char}
                        </div>
                        <div className={`text-lg font-bold ${ELEMENT_COLORS[pl.branch.elementKo] || 'text-slate-700'}`}>
                          {pl.branch.char}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* ── 항목별 분석 (무료: 점수 + 바 + 한줄 요약 + 기본 설명) ── */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-700 text-center">📊 항목별 분석</h3>
        {items.map((item: any, idx: number) => {
          const pct = Math.round((item.score / item.maxScore) * 100)
          const icon = ITEM_ICONS[item.category] || '📌'
          return (
            <div key={idx} className="bg-white/80 rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-700">{icon} {item.category}</span>
                <span className={`text-sm font-bold ${gradeColor(item.grade)}`}>
                  {item.score}/{item.maxScore}점 · {gradeLabel(item.grade)}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 mb-3">
                <div className={`h-2.5 rounded-full ${barColor(pct)} transition-all`}
                  style={{ width: `${pct}%` }} />
              </div>
              <p className="text-sm text-slate-600 mb-2">{item.description}</p>
              {item.details?.length > 0 && (
                <ul className="space-y-1">
                  {item.details.map((d: string, i: number) => (
                    <li key={i} className="text-xs text-slate-500 flex items-start gap-1.5">
                      <span className="text-slate-300 mt-0.5">•</span><span>{d}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>

      {/* ═══════════ 구분선 ═══════════ */}
      <div className="flex items-center gap-3 py-2">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent" />
        <span className="text-sm font-bold text-pink-500">💕 상세 궁합 분석</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent" />
      </div>

      {/* ═══════════ 광고 후 영역 ═══════════ */}

      {!detailUnlocked ? (
        /* ── 잠금 상태: blur 미리보기 + 해제 버튼 ── */
        <div className="relative">
          {/* blur 미리보기 */}
          <div className="blur-sm pointer-events-none select-none space-y-4">
            {items.map((item: any, idx: number) => (
              <div key={idx} className="bg-white/80 rounded-2xl border border-slate-200 p-5">
                <p className="text-sm font-bold text-slate-700 mb-2">
                  {ITEM_ICONS[item.category]} {item.category} — 심층 분석
                </p>
                <p className="text-sm text-slate-600">
                  {item.detailedAnalysis?.interpretation?.slice(0, 60) || '상세 해석 내용'}...
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  관계 역학 · 맞춤 조언 · 키워드
                </p>
              </div>
            ))}
            <div className="bg-gradient-to-br from-indigo-50 to-pink-50 rounded-2xl p-5">
              <p className="text-base font-bold text-slate-700">💡 궁합 조언</p>
              <p className="text-sm text-slate-600 mt-2">맞춤형 궁합 조언 내용...</p>
            </div>
          </div>

          {/* 해제 안내 오버레이 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/95 rounded-2xl shadow-xl border border-pink-200 p-6 text-center max-w-sm mx-4">
              <div className="text-4xl mb-3">🔒</div>
              <h4 className="text-lg font-bold text-slate-700 mb-2">상세 궁합 분석</h4>
              <p className="text-sm text-slate-500 mb-1">5개 항목 심층 해석 + 관계 역학</p>
              <p className="text-sm text-slate-500 mb-4">맞춤 조언 + 키워드 분석</p>
              <button
                onClick={() => setDetailUnlocked(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-bold hover:from-pink-600 hover:to-indigo-600 transition shadow-md"
              >
                🎬 광고 보고 상세 분석 보기
              </button>
              <p className="text-xs text-slate-400 mt-2">광고 시청 후 무료로 확인할 수 있습니다</p>
            </div>
          </div>
        </div>
      ) : (
        /* ── 해제 상태: 상세 분석 + 조언 ── */
        <div className="space-y-4">
          {/* 항목별 상세 해석 */}
          {items.map((item: any, idx: number) => {
            const da = item.detailedAnalysis
            if (!da) return null
            const icon = ITEM_ICONS[item.category] || '📌'
            return (
              <div key={idx} className="bg-white/80 rounded-2xl border border-slate-200 p-5 space-y-3">
                <h4 className="text-sm font-bold text-slate-700">
                  {icon} {item.category} — 심층 분석
                </h4>

                {/* 심층 해석 */}
                <div>
                  <p className="text-xs font-semibold text-indigo-500 mb-1">📖 심층 해석</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{da.interpretation}</p>
                </div>

                {/* 관계 역학 */}
                <div>
                  <p className="text-xs font-semibold text-pink-500 mb-1">🔄 관계 역학</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{da.relationship}</p>
                </div>

                {/* 맞춤 조언 */}
                <div>
                  <p className="text-xs font-semibold text-emerald-500 mb-1">💡 맞춤 조언</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{da.advice}</p>
                </div>

                {/* 키워드 */}
                {da.keywords?.length > 0 && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs text-slate-400">#</span>
                    {da.keywords.map((kw: string, i: number) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {/* 궁합 조언 */}
          {c.advice?.length > 0 && (
            <div className="bg-gradient-to-br from-indigo-50 to-pink-50 rounded-2xl border border-indigo-100 p-5">
              <h3 className="text-base font-bold text-slate-700 mb-3">💡 궁합 조언</h3>
              <ul className="space-y-2">
                {c.advice.map((a: string, i: number) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-indigo-400 mt-0.5">✦</span><span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ── 안내 ── */}
      <p className="text-center text-xs text-slate-400">
        궁합 분석은 사주명리학을 기반으로 한 참고 정보이며, 절대적인 것은 아닙니다.
      </p>
    </div>
  )
}