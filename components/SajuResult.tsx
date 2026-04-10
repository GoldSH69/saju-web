'use client'

import { useState } from 'react'

// ─── 한자→오행 매핑 ─────────────────────────────────────
const CHAR_ELEMENT: Record<string, string> = {
  '甲': 'wood', '乙': 'wood', '丙': 'fire', '丁': 'fire',
  '戊': 'earth', '己': 'earth', '庚': 'metal', '辛': 'metal',
  '壬': 'water', '癸': 'water',
  '子': 'water', '丑': 'earth', '寅': 'wood', '卯': 'wood',
  '辰': 'earth', '巳': 'fire', '午': 'fire', '未': 'earth',
  '申': 'metal', '酉': 'metal', '戌': 'earth', '亥': 'water',
}

const ELEMENT_STYLE: Record<string, { bg: string; text: string }> = {
  wood:  { bg: 'bg-green-600 border-2 border-black',  text: 'text-white [text-shadow:_1px_1px_0_rgb(0_0_0),_-1px_-1px_0_rgb(0_0_0),_1px_-1px_0_rgb(0_0_0),_-1px_1px_0_rgb(0_0_0)]' },
  fire:  { bg: 'bg-red-600 border-2 border-black',    text: 'text-white [text-shadow:_1px_1px_0_rgb(0_0_0),_-1px_-1px_0_rgb(0_0_0),_1px_-1px_0_rgb(0_0_0),_-1px_1px_0_rgb(0_0_0)]' },
  earth: { bg: 'bg-yellow-400 border-2 border-black', text: 'text-white [text-shadow:_1px_1px_0_rgb(0_0_0),_-1px_-1px_0_rgb(0_0_0),_1px_-1px_0_rgb(0_0_0),_-1px_1px_0_rgb(0_0_0)]' },
  metal: { bg: 'bg-white border-2 border-black',      text: 'text-white [text-shadow:_1px_1px_0_rgb(0_0_0),_-1px_-1px_0_rgb(0_0_0),_1px_-1px_0_rgb(0_0_0),_-1px_1px_0_rgb(0_0_0)]' },
  water: { bg: 'bg-black border-2 border-black',      text: 'text-white [text-shadow:_1px_1px_0_rgb(0_0_0),_-1px_-1px_0_rgb(0_0_0),_1px_-1px_0_rgb(0_0_0),_-1px_1px_0_rgb(0_0_0)]' },
}

const ELEMENT_KO: Record<string, string> = {
  wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)',
}

const BAR_COLORS: Record<string, string> = {
  wood: 'bg-green-600', fire: 'bg-red-600', earth: 'bg-yellow-400',
  metal: 'bg-gray-300', water: 'bg-black',
}

const BRANCH_CHARS = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']

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

// ─── 광고 잠금 공통 컴포넌트 ────────────────────────────
function BlurredContent({
  preview,
  children,
  isUnlocked,
  onUnlock,
  label,
}: {
  preview: React.ReactNode
  children: React.ReactNode
  isUnlocked: boolean
  onUnlock: () => void
  label: string
}) {
  if (isUnlocked) return <>{children}</>
  return (
    <div className="relative">
      {/* 미리보기 (선명하게) */}
      {preview}
      {/* blur 영역 */}
      <div className="relative mt-2">
        <div className="blur-sm pointer-events-none select-none opacity-60 max-h-32 overflow-hidden">
          {children}
        </div>
        {/* 그라데이션 오버레이 + 버튼 */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 to-white flex flex-col items-center justify-end pb-4">
          <p className="text-xs text-slate-500 mb-2">🔒 {label}</p>
          <button
            onClick={onUnlock}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-bold hover:bg-indigo-700 transition shadow-lg"
          >
            🔓 광고 보고 전체 내용 확인
          </button>
        </div>
      </div>
    </div>
  )
}

function LockedGuide({
  items,
  isUnlocked,
  onUnlock,
  children,
}: {
  items: string[]
  isUnlocked: boolean
  onUnlock: () => void
  children: React.ReactNode
}) {
  if (isUnlocked) return <>{children}</>
  return (
    <div className="flex flex-col items-center py-6">
      <div className="bg-slate-50 rounded-xl p-5 mb-4 text-left w-full max-w-sm">
        <p className="text-sm font-bold text-slate-700 mb-3">📋 포함 내용</p>
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={onUnlock}
        className="px-5 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-bold hover:bg-indigo-700 transition shadow-lg"
      >
        🔓 광고 보고 분석 결과 확인
      </button>
    </div>
  )
}

// ─── 한자 셀 컴포넌트 ───────────────────────────────────
function HanjaCell({ char, element }: { char: string; element: string }) {
  const style = ELEMENT_STYLE[element] || ELEMENT_STYLE.earth
  return (
    <div className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-md ${style.bg}`}>
      <span className={`hanja text-2xl sm:text-3xl font-bold ${style.text}`}>{char}</span>
    </div>
  )
}

function SmallHanjaCell({ char, element, size = 'normal' }: { char: string; element: string; size?: 'normal' | 'small' }) {
  const resolvedElement = CHAR_ELEMENT[char] || element || 'earth'
  const style = ELEMENT_STYLE[resolvedElement] || ELEMENT_STYLE.earth
  const sizeClass = size === 'small'
    ? 'w-8 h-8 sm:w-10 sm:h-10 text-base sm:text-lg'
    : 'w-10 h-10 sm:w-12 sm:h-12 text-lg sm:text-xl'
  return (
    <div className={`${sizeClass} flex items-center justify-center rounded-md ${style.bg}`}>
      <span className={`hanja font-bold ${style.text}`}>{char}</span>
    </div>
  )
}

// ─── 유틸 함수 ──────────────────────────────────────────
function getCurrentAge(birthYear: number): number {
  return new Date().getFullYear() - birthYear
}

function getCurrentDaewoonIndex(entries: any[]): number {
  const currentYear = new Date().getFullYear()
  for (let i = 0; i < entries.length; i++) {
    if (currentYear >= entries[i].startYear && currentYear <= entries[i].endYear) return i
  }
  return -1
}

function getMainBranchStar(branchStars: any[]): string {
  if (!branchStars || branchStars.length === 0) return ''
  return branchStars[branchStars.length - 1]?.tenStar || ''
}

function getStemElement(entry: any): string {
  return entry.tenStar?.stemElement || entry.stemElement || 'earth'
}

function getBranchElement(entry: any): string {
  return entry.tenStar?.branchElement || entry.branchElement || 'earth'
}

function getGanjiChars(entry: any): [string, string] {
  const ganji = entry.ganji || entry.ganjiChar || ''
  return [ganji[0] || '?', ganji[1] || '?']
}

// ─── 4기둥 테이블 ────────────────────────────────────────
function FourPillarsTable({ pillars, tenStars }: { pillars: any; tenStars: any }) {
  const cols = [
    { label: '시주', pillar: pillars.hour, stemStar: tenStars?.hourStem?.tenStar || '', branchStar: getMainBranchStar(tenStars?.hourBranchStars) },
    { label: '일주', pillar: pillars.day, stemStar: '일간(나)', branchStar: getMainBranchStar(tenStars?.dayBranchStars) },
    { label: '월주', pillar: pillars.month, stemStar: tenStars?.monthStem?.tenStar || '', branchStar: getMainBranchStar(tenStars?.monthBranchStars) },
    { label: '년주', pillar: pillars.year, stemStar: tenStars?.yearStem?.tenStar || '', branchStar: getMainBranchStar(tenStars?.yearBranchStars) },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="mx-auto border-collapse">
        <thead>
          <tr>
            {cols.map((col, i) => (
              <th key={i} className="px-2 sm:px-4 pb-1 text-xs sm:text-sm font-medium text-slate-500">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>{cols.map((col, i) => (
            <td key={i} className="px-2 sm:px-4 py-0.5 text-center">
              <span className={`text-xs sm:text-sm ${i === 1 ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}>{col.pillar ? col.stemStar : ''}</span>
            </td>
          ))}</tr>
          <tr>{cols.map((col, i) => (
            <td key={i} className="px-2 sm:px-4 py-0.5">
              <div className="flex justify-center">
                {col.pillar ? <HanjaCell char={col.pillar.stem.char} element={col.pillar.stem.element} /> : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-md border-2 border-dashed border-slate-200"><span className="text-slate-300 text-xs">?</span></div>
                )}
              </div>
            </td>
          ))}</tr>
          <tr>{cols.map((col, i) => (
            <td key={i} className="px-2 sm:px-4 py-0.5">
              <div className="flex justify-center">
                {col.pillar ? <HanjaCell char={col.pillar.branch.char} element={col.pillar.branch.element} /> : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-md border-2 border-dashed border-slate-200"><span className="text-slate-300 text-xs">?</span></div>
                )}
              </div>
            </td>
          ))}</tr>
          <tr>{cols.map((col, i) => (
            <td key={i} className="px-2 sm:px-4 py-0.5 text-center">
              <span className="text-xs sm:text-sm text-slate-500">{col.pillar ? col.branchStar : ''}</span>
            </td>
          ))}</tr>
          <tr>{cols.map((col, i) => (
            <td key={i} className="px-2 sm:px-4 pt-1 text-center">
              <span className="text-[10px] sm:text-xs text-slate-400">{col.pillar ? col.pillar.ganjiName : ''}</span>
            </td>
          ))}</tr>
        </tbody>
      </table>
    </div>
  )
}

// ─── 오행 분포 바 ────────────────────────────────────────
function FiveElementBar({ counts }: { counts: Record<string, number> }) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  if (total === 0) return null
  const elements = ['wood', 'fire', 'earth', 'metal', 'water']
  return (
    <div>
      <div className="flex rounded-full overflow-hidden h-7 sm:h-8 mb-3">
        {elements.map(el => {
          const count = counts[el] || 0
          if (count === 0) return null
          const pct = (count / total) * 100
          return (
            <div key={el} className={`${BAR_COLORS[el]} flex items-center justify-center text-white text-xs font-bold`}
              style={{ width: `${pct}%`, minWidth: count > 0 ? '24px' : '0' }}>{count}</div>
          )
        })}
      </div>
      <div className="flex flex-wrap justify-center gap-3 text-xs">
        {elements.map(el => {
          const count = counts[el] || 0
          return (
            <div key={el} className="flex items-center gap-1">
              <span className={`w-3 h-3 rounded-full ${BAR_COLORS[el]} ${el === 'metal' ? 'border border-slate-400' : ''}`}></span>
              <span className={count === 0 ? 'text-slate-300' : 'text-slate-600'}>{ELEMENT_KO[el]} {count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── 십성 분포 ──────────────────────────────────────────
function TenStarSection({ tenStars }: { tenStars: any }) {
  if (!tenStars) return null
  const categories = [
    { key: '비겁', label: '비겁', sub: '比劫', stars: ['비견', '겁재'], color: 'bg-yellow-50 border-yellow-300 text-yellow-800' },
    { key: '식상', label: '식상', sub: '食傷', stars: ['식신', '상관'], color: 'bg-green-50 border-green-300 text-green-800' },
    { key: '재성', label: '재성', sub: '財星', stars: ['편재', '정재'], color: 'bg-blue-50 border-blue-300 text-blue-800' },
    { key: '관성', label: '관성', sub: '官星', stars: ['편관', '정관'], color: 'bg-red-50 border-red-300 text-red-800' },
    { key: '인성', label: '인성', sub: '印星', stars: ['편인', '정인'], color: 'bg-purple-50 border-purple-300 text-purple-800' },
  ]
  const categoryCount = { ...tenStars.categoryCount }
  if (categoryCount['비화'] !== undefined && categoryCount['비겁'] === undefined) {
    categoryCount['비겁'] = categoryCount['비화']
  }
  const { starCount, yearStem, monthStem, hourStem } = tenStars
  const positionStars = [
    { pos: '시간', star: hourStem?.tenStar, target: hourStem?.target },
    { pos: '일간', star: '일간(나)', target: tenStars.dayStem, isMe: true },
    { pos: '월간', star: monthStem?.tenStar, target: monthStem?.target },
    { pos: '년간', star: yearStem?.tenStar, target: yearStem?.target },
  ]
  const branchPositions = [
    { pos: '시지', stars: tenStars.hourBranchStars },
    { pos: '일지', stars: tenStars.dayBranchStars },
    { pos: '월지', stars: tenStars.monthBranchStars },
    { pos: '년지', stars: tenStars.yearBranchStars },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {categories.map(cat => (
          <div key={cat.key} className={`rounded-xl p-2 sm:p-3 text-center border ${cat.color}`}>
            <div className="text-[10px] sm:text-xs font-bold">{cat.label}</div>
            <div className="text-[9px] text-slate-400">{cat.sub}</div>
            <div className="text-xl sm:text-2xl font-bold my-1">{categoryCount[cat.key] || 0}</div>
            <div className="text-[9px] sm:text-[10px] opacity-80 space-y-0.5">
              {cat.stars.map(s => (<div key={s}>{s} {starCount[s] || 0}</div>))}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-slate-50 rounded-xl p-3">
        <div className="text-xs font-medium text-slate-600 mb-2">천간 십성</div>
        <div className="grid grid-cols-4 gap-1.5 text-xs">
          {positionStars.map((item: any) => (
            <div key={item.pos} className={`flex justify-between rounded-lg px-3 py-2 ${item.isMe ? 'bg-indigo-50 border border-indigo-200' : 'bg-white'}`}>
              <span className={item.isMe ? 'text-indigo-600 font-bold' : 'text-slate-500'}>{item.pos}</span>
              <span className={item.isMe ? 'font-bold text-indigo-700' : 'font-medium text-slate-800'}>
                {item.isMe ? `${item.target} (나)` : (item.target ? `${item.target} → ${item.star}` : '-')}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-slate-50 rounded-xl p-3">
        <div className="text-xs font-medium text-slate-600 mb-2">지지 십성 (지장간)</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
          {branchPositions.map(item => (
            <div key={item.pos} className="bg-white rounded-lg px-3 py-2">
              <div className="text-slate-500 mb-1">{item.pos}</div>
              {item.stars && item.stars.length > 0 ? (
                item.stars.map((s: any, i: number) => (
                  <div key={i} className="text-slate-700">
                    {s.target} → <span className="font-medium">{s.tenStar}</span>
                    {i === item.stars.length - 1 && (<span className="text-indigo-500 text-[9px] ml-1">본기</span>)}
                  </div>
                ))
              ) : (<div className="text-slate-300">-</div>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── 일간 성격 해석 ─────────────────────────────────────
function DayStemInterpretation({ interp }: { interp: any }) {
  if (!interp?.dayStem) return null
  const ds = interp.dayStem
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-3">🧑 일간 성격 — {ds.symbol} {ds.char}({ds.name})</h2>
      <div className="bg-indigo-50 rounded-xl p-4 mb-3">
        <TextWithLineBreaks text={ds.short} className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed" />
      </div>
      <div className="bg-slate-50 rounded-xl p-4">
        <TextWithLineBreaks text={ds.detail} className="text-xs sm:text-sm text-slate-600 leading-relaxed" />
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {ds.keywords.map((kw: string, i: number) => (
          <span key={i} className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">#{kw}</span>
        ))}
      </div>
    </div>
  )
}

// ─── 오행 해석 (광고 콘텐츠) ────────────────────────────
function FiveElementInterpretation({ interp, isUnlocked, onUnlock }: { interp: any; isUnlocked: boolean; onUnlock: () => void }) {
  const dfe = interp?.detailedFiveElements
  const fe = interp?.fiveElements
  if (!dfe && (!fe || (fe.excess.length === 0 && fe.lack.length === 0))) return null

  const previewText = dfe
    ? `오행 균형 점수: ${dfe.balance.score}점 (${dfe.balance.type}) · 최강: ${dfe.scoreRanking[0]?.ko}`
    : fe.excess.length > 0
      ? `${fe.excess[0].elementKo}이(가) ${fe.excess[0].count}개로 강합니다`
      : `${fe.lack[0].elementKo}이(가) 부족합니다`

  const RANK_BAR_COLORS: Record<string, string> = {
    '木': 'bg-green-500', '火': 'bg-red-500', '土': 'bg-yellow-400', '金': 'bg-gray-300', '水': 'bg-slate-800',
  }

  const fullContent = dfe ? (
    <>
      {/* 가중치 점수 순위 */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-700 mb-2">📊 오행 가중치 점수</h3>
        <div className="space-y-2">
          {dfe.scoreRanking.map((item: any, i: number) => {
            const statusColor =
              item.status === '과다' ? 'text-red-600' :
              item.status === '강함' ? 'text-orange-600' :
              item.status === '결핍' ? 'text-blue-600' :
              item.status === '약함' ? 'text-sky-600' : 'text-slate-600'
            const barWidth = Math.max(5, item.percent)
            const barColor = RANK_BAR_COLORS[item.element] || 'bg-slate-400'
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs w-14 text-slate-600 font-medium">{item.ko}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
                  <div className={`${barColor} h-full rounded-full flex items-center justify-end pr-2`} style={{ width: `${barWidth}%` }}>
                    {item.percent >= 15 && <span className="text-[10px] text-white font-bold">{item.score}</span>}
                  </div>
                </div>
                {item.percent < 15 && <span className="text-[10px] text-slate-500">{item.score}</span>}
                <span className={`text-[10px] font-bold w-8 ${statusColor}`}>{item.status}</span>
                <span className="text-[10px] text-slate-400 w-8">{item.percent}%</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* 최강/최약 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
        <div className="bg-red-50 rounded-xl p-3 border border-red-200">
          <div className="text-xs font-bold text-red-700 mb-1">📈 최강 오행</div>
          <TextWithLineBreaks text={dfe.strongestText} className="text-xs text-slate-600 leading-relaxed" />
        </div>
        <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
          <div className="text-xs font-bold text-blue-700 mb-1">📉 최약 오행</div>
          <TextWithLineBreaks text={dfe.weakestText} className="text-xs text-slate-600 leading-relaxed" />
        </div>
      </div>

      {/* 월령 분석 */}
      <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 mb-4">
        <div className="text-xs font-bold text-amber-700 mb-1">🌙 월령(출생 계절) — {dfe.monthAnalysis.ko} ({dfe.monthAnalysis.season})</div>
        <p className="text-xs text-slate-600 mb-1">{dfe.monthAnalysis.description}</p>
        <p className="text-xs text-slate-700 font-medium">{dfe.monthAnalysis.relation}</p>
      </div>

      {/* 균형 진단 */}
      <div className="bg-slate-50 rounded-xl p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700">⚖️ 균형 진단</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
            dfe.balance.score >= 80 ? 'bg-green-100 text-green-700' :
            dfe.balance.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
            dfe.balance.score >= 40 ? 'bg-orange-100 text-orange-700' :
            'bg-red-100 text-red-700'
          }`}>{dfe.balance.score}점 · {dfe.balance.type}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
          <div className={`h-full rounded-full ${
            dfe.balance.score >= 80 ? 'bg-green-500' :
            dfe.balance.score >= 60 ? 'bg-yellow-500' :
            dfe.balance.score >= 40 ? 'bg-orange-500' : 'bg-red-500'
          }`} style={{ width: `${dfe.balance.score}%` }}></div>
        </div>
        <p className="text-xs text-slate-600">{dfe.balance.description}</p>
      </div>

      {/* 위치별 오행 배치 */}
      {dfe.positionAnalysis.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-700 mb-2">📍 위치별 오행 배치</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {dfe.positionAnalysis.map((pa: any, i: number) => (
              <div key={i} className={`rounded-lg p-2.5 border ${pa.position === '일간' ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-700">{pa.label}</span>
                  <span className="text-xs text-slate-500">{pa.elementKo} {pa.char}</span>
                </div>
                <div className="text-[10px] text-slate-400 mb-1">{pa.meaning}</div>
                <p className="text-xs text-slate-600">{pa.interpretation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 보충 추천 */}
      <div className="bg-green-50 rounded-xl p-3 border border-green-200">
        <div className="text-xs font-bold text-green-700 mb-2">💡 오행 보충 추천 — {dfe.supplement.ko}</div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="text-xs text-slate-600">🎨 색상: <span className="font-medium">{dfe.supplement.color}</span></div>
          <div className="text-xs text-slate-600">🧭 방향: <span className="font-medium">{dfe.supplement.direction}</span></div>
          <div className="text-xs text-slate-600">🍽️ 맛: <span className="font-medium">{dfe.supplement.taste}</span></div>
          <div className="text-xs text-slate-600">🏃 활동: <span className="font-medium">{dfe.supplement.activity}</span></div>
        </div>
        <p className="text-xs text-slate-600">{dfe.supplement.description}</p>
      </div>
    </>
  ) : (
    <>
      {fe.excess.length > 0 && (
        <div className="mb-3">
          <h3 className="text-sm font-bold text-red-600 mb-2">📈 과다한 오행</h3>
          <div className="space-y-2">
            {fe.excess.map((item: any, i: number) => (
              <div key={i} className="bg-red-50 rounded-xl p-3 border border-red-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-red-700">{item.elementKo}</span>
                  <span className="text-xs text-red-500">({item.count}개)</span>
                </div>
                <TextWithLineBreaks text={item.detail} className="text-xs text-slate-600" />
              </div>
            ))}
          </div>
        </div>
      )}
      {fe.lack.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-blue-600 mb-2">📉 부족한 오행</h3>
          <div className="space-y-2">
            {fe.lack.map((item: any, i: number) => (
              <div key={i} className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-blue-700">{item.elementKo}</span>
                  <span className="text-xs text-blue-500">({item.count}개)</span>
                </div>
                <TextWithLineBreaks text={item.detail} className="text-xs text-slate-600" />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-3">🌿 오행 상세 분석</h2>
      <BlurredContent
        preview={
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-sm text-slate-700 font-medium">{previewText}</p>
          </div>
        }
        isUnlocked={isUnlocked}
        onUnlock={onUnlock}
        label="가중치 기반 오행 상세 분석"
      >
        {fullContent}
      </BlurredContent>
    </div>
  )
}

// ─── 십성 해석 (광고 콘텐츠) ────────────────────────────
function TenStarInterpretation({ interp, isUnlocked, onUnlock }: { interp: any; isUnlocked: boolean; onUnlock: () => void }) {
  if (!interp?.tenStars && !interp?.detailedTenStars) return null
  const ts = interp.tenStars
  const dts = interp.detailedTenStars
  if (!dts && (!ts || (!ts.dominant && ts.excess.length === 0 && ts.lack.length === 0))) return null

  const previewText = ts?.dominant
    ? `주요 십성: ${ts.dominant.star} (${ts.dominant.count}개)${dts ? ` · ${dts.patterns.length > 0 ? dts.patterns[0].name + ' 구조 발견' : ''}` : ''}`
    : '십성 분석 결과가 준비되었습니다'

  const CAT_COLORS: Record<string, string> = {
    '비겁': 'bg-yellow-50 border-yellow-300 text-yellow-800',
    '식상': 'bg-green-50 border-green-300 text-green-800',
    '재성': 'bg-blue-50 border-blue-300 text-blue-800',
    '관성': 'bg-red-50 border-red-300 text-red-800',
    '인성': 'bg-purple-50 border-purple-300 text-purple-800',
  }

  const STATUS_COLORS: Record<string, string> = {
    '과다': 'text-red-600',
    '강함': 'text-orange-600',
    '보통': 'text-slate-600',
    '약함': 'text-sky-600',
    '없음': 'text-blue-600',
  }

  const fullContent = (
    <>
      {/* 기존: 주요 십성 */}
      {ts?.dominant && (
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-purple-700 font-bold text-sm">👑 주요 십성: {ts.dominant.star}</span>
            <span className="text-xs text-purple-500">({ts.dominant.count}개)</span>
          </div>
          <TextWithLineBreaks text={ts.dominant.short} className="text-sm text-slate-700 mb-2" />
          <TextWithLineBreaks text={ts.dominant.detail} className="text-xs text-slate-500" />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {ts.dominant.keywords.map((kw: string, i: number) => (
              <span key={i} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-[10px] font-medium">#{kw}</span>
            ))}
          </div>
        </div>
      )}

      {/* C2: 위치별 십성 해석 */}
      {dts?.positionAnalysis && dts.positionAnalysis.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-700 mb-2">📍 위치별 십성 해석</h3>
          <div className="space-y-2">
            {dts.positionAnalysis.map((pa: any, i: number) => (
              <div key={i} className="bg-white rounded-lg p-3 border border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-bold">{pa.position}</span>
                  <span className="text-xs text-slate-500">{pa.positionMeaning}</span>
                </div>
                <div className="text-xs font-medium text-slate-700 mb-1">
                  {pa.target} → <span className="text-indigo-600 font-bold">{pa.star}</span>
                </div>
                <p className="text-xs text-slate-600">{pa.interpretation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* C2: 카테고리 종합 분석 */}
      {dts?.categoryAnalysis && (
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-700 mb-2">📊 카테고리 분포</h3>
          <div className="space-y-2">
            {dts.categoryAnalysis.map((ca: any, i: number) => {
              const colorClass = CAT_COLORS[ca.category] || 'bg-slate-50 border-slate-300 text-slate-800'
              const statusColor = STATUS_COLORS[ca.status] || 'text-slate-600'
              return (
                <div key={i} className={`rounded-xl p-3 border ${colorClass}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{ca.category}</span>
                      <span className="text-[10px] opacity-60">{ca.hanja}</span>
                      <span className="text-[10px] text-slate-500">{ca.theme}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{ca.count}개</span>
                      <span className={`text-[10px] font-bold ${statusColor}`}>{ca.status}</span>
                      <span className="text-[10px] text-slate-400">{ca.percent}%</span>
                    </div>
                  </div>
                  {/* 비율 바 */}
                  <div className="w-full bg-white/50 rounded-full h-1.5 mb-1">
                    <div className="bg-current h-full rounded-full opacity-40" style={{ width: `${Math.max(3, ca.percent)}%` }}></div>
                  </div>
                  {ca.description && (
                    <p className="text-xs opacity-80 mt-1">{ca.description}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* C2: 십성 조합 패턴 */}
      {dts?.patterns && dts.patterns.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-700 mb-2">🔗 십성 조합 패턴</h3>
          <div className="space-y-2">
            {dts.patterns.map((p: any, i: number) => (
              <div key={i} className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-3 border border-indigo-200">
                <div className="font-bold text-sm text-indigo-700 mb-1">✨ {p.name}</div>
                <p className="text-xs text-slate-600">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* C2: 인생 테마 종합 */}
      {dts?.lifeTheme && (
        <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-200 mb-4">
          <div className="text-xs font-bold text-indigo-700 mb-1">🎯 인생 테마 종합</div>
          <TextWithLineBreaks text={dts.lifeTheme} className="text-xs text-slate-600 leading-relaxed" />
        </div>
      )}

      {/* 기존: 과다/부족 */}
      {ts?.excess.length > 0 && (
        <div className="mb-3">
          <h3 className="text-xs font-bold text-red-600 mb-1.5">과다 십성</h3>
          <div className="space-y-1.5">
            {ts.excess.map((item: any, i: number) => (
              <div key={i} className="bg-red-50 rounded-lg p-2.5 border border-red-200 text-xs">
                <span className="font-bold text-red-700">{item.star} ({item.count}개)</span>
                <span className="text-slate-600 ml-2">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {ts?.lack.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-blue-600 mb-1.5">부족 십성</h3>
          <div className="space-y-1.5">
            {ts.lack.map((item: any, i: number) => (
              <div key={i} className="bg-blue-50 rounded-lg p-2.5 border border-blue-200 text-xs">
                <span className="font-bold text-blue-700">{item.star} ({item.count}개)</span>
                <span className="text-slate-600 ml-2">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-3">⭐ 십성 상세 분석</h2>
      <BlurredContent
        preview={
          <div className="bg-purple-50 rounded-xl p-3">
            <p className="text-sm text-slate-700 font-medium">👑 {previewText}</p>
          </div>
        }
        isUnlocked={isUnlocked}
        onUnlock={onUnlock}
        label="위치별 · 카테고리 · 조합 패턴 상세 분석"
      >
        {fullContent}
      </BlurredContent>
    </div>
  )
}

// ─── 신강/신약 해석 (광고 콘텐츠) ───────────────────────
function StrengthSection({ strength, yongsin, interp, isUnlocked, onUnlock }: {
  strength: any; yongsin: any; interp: any; isUnlocked: boolean; onUnlock: () => void
}) {
  const st = interp?.strength

  const fullContent = (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className={`px-5 py-2 rounded-full text-lg font-bold text-center ${strength.result === '신강' ? 'bg-red-100 text-red-700' : strength.result === '신약' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
          {strength.result}
        </div>
        <div className="text-sm text-slate-500 text-center sm:text-left">
          <span>돕는 힘 <strong>{strength.helpScore.toFixed(1)}</strong></span>
          <span className="mx-2">vs</span>
          <span>억제 힘 <strong>{strength.restrainScore.toFixed(1)}</strong></span>
          <span className="ml-2 font-medium text-slate-700">(차이: {strength.score > 0 ? '+' : ''}{strength.score.toFixed(1)})</span>
        </div>
      </div>

      {st && (
        <div className="space-y-3">
          <div className="bg-slate-50 rounded-xl p-4">
            <TextWithLineBreaks text={`${st.symbol} ${st.short}`} className="text-sm text-slate-700 font-medium mb-1" />
            <TextWithLineBreaks text={st.detail} className="text-xs text-slate-500 leading-relaxed" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="font-bold text-blue-700 mb-1">💼 직업/적성</div>
              <TextWithLineBreaks text={st.career} className="text-slate-600" />
            </div>
            <div className="bg-pink-50 rounded-lg p-3 border border-pink-200">
              <div className="font-bold text-pink-700 mb-1">💕 대인관계</div>
              <TextWithLineBreaks text={st.relationship} className="text-slate-600" />
            </div>
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
              <div className="font-bold text-amber-700 mb-1">💰 재물운</div>
              <TextWithLineBreaks text={st.wealth} className="text-slate-600" />
            </div>
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="font-bold text-green-700 mb-1">🏥 건강</div>
              <TextWithLineBreaks text={st.health} className="text-slate-600" />
            </div>
          </div>
          <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-200">
            <div className="font-bold text-indigo-700 text-xs mb-1">💡 조언</div>
            <TextWithLineBreaks text={st.advice} className="text-xs text-slate-600" />
          </div>
        </div>
      )}

      <div className="bg-indigo-50 rounded-xl p-4 mt-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-indigo-600 font-bold">용신(用神)</span>
          <span className="px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-800 text-sm font-medium">{yongsin.yongsinKo} ({yongsin.yongsin})</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm">
          <div><span className="text-green-600 font-medium">✅ 좋은 오행: </span><span className="text-slate-700">{yongsin.guide.favorableElements.join(', ')}</span></div>
          <div><span className="text-red-600 font-medium">❌ 나쁜 오행: </span><span className="text-slate-700">{yongsin.guide.unfavorableElements.join(', ')}</span></div>
        </div>
      </div>
    </>
  )

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4">⚖️ 신강/신약 · 용신 분석</h2>
      <LockedGuide
        items={[
          '신강/신약 판단 결과 및 점수',
          '용신(用神) — 당신에게 필요한 오행',
          '직업/적성 맞춤 분석',
          '대인관계 · 재물운 · 건강 분석',
          '좋은 오행 / 나쁜 오행 안내',
          '종합 조언',
        ]}
        isUnlocked={isUnlocked}
        onUnlock={onUnlock}
      >
        {fullContent}
      </LockedGuide>
    </div>
  )
}

// ─── 공망 섹션 ──────────────────────────────────────────
function GongmangSection({ gongmang }: { gongmang: any }) {
  if (!gongmang) return null
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-3">🕳️ 공망 (空亡)</h2>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-slate-50 rounded-xl p-3 text-center">
          <div className="text-xs text-slate-500 mb-1">년주 기준 공망</div>
          <div className="text-lg font-bold text-slate-800">{gongmang.yearGongmang.chars[0]} {gongmang.yearGongmang.chars[1]}</div>
          <div className="text-[10px] text-slate-400">({gongmang.yearGongmang.names[0]} · {gongmang.yearGongmang.names[1]})</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{gongmang.yearGongmang.sunName} ({gongmang.yearGongmang.sunNameKo})</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 text-center">
          <div className="text-xs text-slate-500 mb-1">일주 기준 공망</div>
          <div className="text-lg font-bold text-slate-800">{gongmang.dayGongmang.chars[0]} {gongmang.dayGongmang.chars[1]}</div>
          <div className="text-[10px] text-slate-400">({gongmang.dayGongmang.names[0]} · {gongmang.dayGongmang.names[1]})</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{gongmang.dayGongmang.sunName} ({gongmang.dayGongmang.sunNameKo})</div>
        </div>
      </div>
      <div className="bg-slate-50 rounded-xl p-3 mb-3">
        <div className="text-xs font-medium text-slate-600 mb-2">원국 지지 공망 여부</div>
        <div className="grid grid-cols-4 gap-2 text-xs">
          {(['year', 'month', 'day', 'hour'] as const).map(pos => {
            const status = gongmang.branchStatus[pos]
            const posLabel = pos === 'year' ? '년지' : pos === 'month' ? '월지' : pos === 'day' ? '일지' : '시지'
            if (!status) return (
              <div key={pos} className="bg-white rounded-lg p-2 text-center">
                <div className="text-slate-400">{posLabel}</div>
                <div className="text-slate-300">-</div>
              </div>
            )
            const isGM = status.isYearGongmang || status.isDayGongmang
            return (
              <div key={pos} className={`rounded-lg p-2 text-center ${isGM ? 'bg-red-50 border border-red-200' : 'bg-white'}`}>
                <div className="text-slate-500">{posLabel}</div>
                <div className="font-bold text-base">{BRANCH_CHARS[status.branchIndex]}</div>
                {isGM ? (
                  <div className="text-red-600 font-bold text-[10px]">공망{status.release && <span className="text-green-600 ml-1">→ 해공</span>}</div>
                ) : (
                  <div className="text-green-600 text-[10px]">정상</div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      {gongmang.summary && gongmang.summary.length > 0 && (
        <div className="space-y-1">
          {gongmang.summary.map((text: string, i: number) => (<p key={i} className="text-xs text-slate-600">• {text}</p>))}
        </div>
      )}
    </div>
  )
}

// ─── 천을귀인 섹션 ──────────────────────────────────────
function GwiinSection({ gwiin }: { gwiin: any }) {
  if (!gwiin) return null
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-3">🌟 천을귀인 (天乙貴人)</h2>
      <div className="bg-amber-50 rounded-xl p-4 mb-3 text-center">
        <div className="text-xs text-slate-500 mb-1">일간 {gwiin.dayStem.char}({gwiin.dayStem.name})의 천을귀인</div>
        <div className="text-2xl font-bold text-amber-700">{gwiin.gwiinPair.chars[0]} · {gwiin.gwiinPair.chars[1]}</div>
        <div className="text-xs text-slate-400 mt-1">({gwiin.gwiinPair.names[0]} · {gwiin.gwiinPair.names[1]})</div>
        <div className="text-[10px] text-slate-400 mt-0.5">{gwiin.gwiinPair.elements[0]} · {gwiin.gwiinPair.elements[1]}</div>
      </div>
      <div className="bg-slate-50 rounded-xl p-3 mb-3">
        <div className="text-xs font-medium text-slate-600 mb-2">원국 지지 귀인 여부</div>
        <div className="grid grid-cols-4 gap-2 text-xs">
          {(['year', 'month', 'day', 'hour'] as const).map(pos => {
            const status = gwiin.branchStatus[pos]
            const posLabel = pos === 'year' ? '년지' : pos === 'month' ? '월지' : pos === 'day' ? '일지' : '시지'
            if (!status) return (
              <div key={pos} className="bg-white rounded-lg p-2 text-center">
                <div className="text-slate-400">{posLabel}</div>
                <div className="text-slate-300">-</div>
              </div>
            )
            return (
              <div key={pos} className={`rounded-lg p-2 text-center ${status.isGwiin ? 'bg-amber-50 border border-amber-300' : 'bg-white'}`}>
                <div className="text-slate-500">{posLabel}</div>
                <div className="font-bold text-base">{BRANCH_CHARS[status.branchIndex]}</div>
                {status.isGwiin ? (
                  <div className="text-amber-600 font-bold text-[10px]">⭐ 귀인</div>
                ) : (
                  <div className="text-slate-400 text-[10px]">-</div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
          gwiin.gwiinCount >= 2 ? 'bg-amber-200 text-amber-800' : gwiin.gwiinCount === 1 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
        }`}>귀인 {gwiin.gwiinCount}개</span>
        {gwiin.gwiinPositions.length > 0 && (<span className="text-xs text-slate-500">위치: {gwiin.gwiinPositions.join(', ')}</span>)}
      </div>
      {gwiin.summary && gwiin.summary.length > 0 && (
        <div className="space-y-1">
          {gwiin.summary.map((text: string, i: number) => (<p key={i} className="text-xs text-slate-600">• {text}</p>))}
        </div>
      )}
    </div>
  )
}

// ─── 오늘의 운세 (맛보기 + 운세 허브 링크) ──────────────
function DailyFortuneSection({ interp, fortune }: { interp: any; fortune: any; isUnlocked?: boolean; onUnlock?: () => void }) {
  if (!interp?.dailyFortune) return null
  const df = interp.dailyFortune
  const today = new Date()
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`
  const dailyGanjiChar = fortune?.daily?.fortune?.ganjiChar || ''
  const dailyGanjiName = fortune?.daily?.fortune?.ganjiName || ''
  const filledStars = Math.max(1, Math.min(5, df.rating))

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-1">🔮 오늘의 운세</h2>
      <p className="text-xs text-slate-400 mb-3">{dateStr}{dailyGanjiChar && ` · ${dailyGanjiChar}(${dailyGanjiName})일`}</p>

      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-lg text-slate-800">{df.theme}</span>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={`text-lg ${i < filledStars ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
            ))}
          </div>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">{df.short}</p>
      </div>

      <a href="/fortune"
        className="block w-full py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm text-center rounded-xl transition border border-indigo-200">
        📅 일운 · 월운 · 세운 자세히 보기 →
      </a>
    </div>
  )
}

// ─── 충합 표시 헬퍼 ─────────────────────────────────────
function renderInteractions(interactions: any) {
  const items: string[] = []
  if (interactions.stemCombinations?.length) interactions.stemCombinations.forEach((c: any) => items.push(`천간합: ${c.stem1}${c.stem2} → ${c.resultElement || ''}`))
  if (interactions.branchClashes?.length) interactions.branchClashes.forEach((c: any) => items.push(`충: ${c.branch1}${c.branch2}`))
  if (interactions.branchCombines?.length) interactions.branchCombines.forEach((c: any) => items.push(`합: ${c.branch1}${c.branch2} → ${c.resultElement || ''}`))
  if (interactions.branchPunishments?.length) interactions.branchPunishments.forEach((c: any) => items.push(`형: ${c.branch1}${c.branch2}`))
  if (interactions.branchHarms?.length) interactions.branchHarms.forEach((c: any) => items.push(`해: ${c.branch1}${c.branch2}`))
  if (items.length === 0) return null
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {items.map((item, i) => (<span key={i} className="px-2 py-1 bg-white rounded-full text-[10px] text-slate-600 border">{item}</span>))}
    </div>
  )
}

// ─── 대운 + 세운 연동 ───────────────────────────────────
function DaewoonSection({ daewoon, birthYear, input }: { daewoon: any; birthYear: number; input: any }) {
  const [selectedIndex, setSelectedIndex] = useState<number>(() => getCurrentDaewoonIndex(daewoon.entries))
  const [fortunes, setFortunes] = useState<any[]>([])
  const [loadingFortune, setLoadingFortune] = useState(false)
  const [selectedFortuneYear, setSelectedFortuneYear] = useState<number | null>(null)
  const currentIndex = getCurrentDaewoonIndex(daewoon.entries)
  const currentAge = getCurrentAge(birthYear)
  const currentYear = new Date().getFullYear()

  async function handleDaewoonClick(index: number) {
    setSelectedIndex(index)
    setSelectedFortuneYear(null)
    const entry = daewoon.entries[index]
    if (!entry) return
    setLoadingFortune(true)
    try {
      const res = await fetch('/api/saju/fortune', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...input, startYear: entry.startYear, endYear: entry.endYear }),
      })
      const data = await res.json()
      setFortunes(data.fortunes || [])
      if (index === currentIndex) setSelectedFortuneYear(currentYear)
    } catch (err) { console.error('세운 로드 실패:', err); setFortunes([]) }
    finally { setLoadingFortune(false) }
  }

  useState(() => { if (currentIndex >= 0) handleDaewoonClick(currentIndex) })

  const selectedEntry = selectedIndex >= 0 ? daewoon.entries[selectedIndex] : null
  const selectedFortune = fortunes.find(f => f.year === selectedFortuneYear)

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mb-3">
        <span>{daewoon.direction === 'forward' ? '순행 ▶' : '◀ 역행'}</span>
        <span>·</span><span>대운시작: {daewoon.startAge.description}</span>
        <span>·</span><span className="text-indigo-600 font-medium">현재 만 {currentAge}세</span>
      </div>
      <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6 pb-3">
        <div className="flex gap-1.5" style={{ minWidth: 'max-content' }}>
          {daewoon.entries.map((entry: any, i: number) => {
            const isCurrent = i === currentIndex; const isSelected = i === selectedIndex
            const chars = getGanjiChars(entry)
            const stemEl = CHAR_ELEMENT[chars[0]] || getStemElement(entry)
            const branchEl = CHAR_ELEMENT[chars[1]] || getBranchElement(entry)
            return (
              <button key={i} onClick={() => handleDaewoonClick(i)}
                className={`flex-shrink-0 text-center px-1.5 py-2 rounded-lg transition cursor-pointer ${isSelected ? 'bg-indigo-100 ring-2 ring-indigo-500' : isCurrent ? 'bg-indigo-50 ring-1 ring-indigo-300' : 'hover:bg-slate-100'}`}
                style={{ minWidth: '52px' }}>
                {isCurrent && <div className="text-[9px] text-indigo-600 font-bold mb-0.5">현재</div>}
                {!isCurrent && <div className="h-3"></div>}
                <div className={`text-[10px] mb-1 ${isSelected ? 'text-indigo-700 font-bold' : 'text-slate-400'}`}>{entry.startAge}~{entry.endAge}세</div>
                <div className="flex justify-center mb-0.5"><SmallHanjaCell char={chars[0]} element={stemEl} /></div>
                <div className="flex justify-center"><SmallHanjaCell char={chars[1]} element={branchEl} /></div>
                <div className={`text-[10px] mt-1 ${isSelected ? 'text-indigo-700 font-medium' : 'text-slate-500'}`}>{entry.ganjiName}</div>
                <div className="text-[9px] text-slate-400">{entry.startYear}</div>
              </button>
            )
          })}
        </div>
      </div>
      {selectedEntry && (
        <div className="mt-3 bg-indigo-50 rounded-xl p-3 sm:p-4">
          <div className="text-sm font-medium text-indigo-700">선택 대운: {selectedEntry.ganji} ({selectedEntry.ganjiName}) · {selectedEntry.startAge}세~{selectedEntry.endAge}세 ({selectedEntry.startYear}~{selectedEntry.endYear}년)</div>
        </div>
      )}
      {selectedEntry && (
        <div className="mt-4">
          <h3 className="text-sm font-bold text-slate-700 mb-2">📅 세운 ({selectedEntry.startYear}~{selectedEntry.endYear}년)</h3>
          {loadingFortune ? (<div className="text-center py-4 text-slate-400 text-sm">세운 계산 중...</div>)
          : fortunes.length > 0 ? (
            <div>
              <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6 pb-3">
                <div className="flex gap-1.5" style={{ minWidth: 'max-content' }}>
                  {fortunes.map((f: any) => {
                    const isCurrentYear = f.year === currentYear; const isSelectedYear = f.year === selectedFortuneYear
                    const ganjiChar = f.fortune?.fortune?.ganjiChar || ''; const ganjiName = f.fortune?.fortune?.ganjiName || ''
                    const stemChar = ganjiChar[0] || ''; const branchChar = ganjiChar[1] || ''
                    const stemEl = CHAR_ELEMENT[stemChar] || f.fortune?.fortune?.stemElement || 'earth'
                    const branchEl = CHAR_ELEMENT[branchChar] || f.fortune?.fortune?.branchElement || 'earth'
                    return (
                      <button key={f.year} onClick={() => setSelectedFortuneYear(f.year)}
                        className={`flex-shrink-0 text-center px-1.5 py-2 rounded-lg transition cursor-pointer ${isSelectedYear ? 'bg-amber-100 ring-2 ring-amber-500' : isCurrentYear ? 'bg-amber-50 ring-1 ring-amber-300' : 'hover:bg-slate-100'}`}
                        style={{ minWidth: '48px' }}>
                        {isCurrentYear && <div className="text-[9px] text-amber-600 font-bold mb-0.5">올해</div>}
                        {!isCurrentYear && <div className="h-3"></div>}
                        <div className={`text-[10px] mb-1 ${isSelectedYear ? 'text-amber-700 font-bold' : 'text-slate-400'}`}>{f.year}년</div>
                        <div className="flex justify-center mb-0.5"><SmallHanjaCell char={stemChar} element={stemEl} size="small" /></div>
                        <div className="flex justify-center"><SmallHanjaCell char={branchChar} element={branchEl} size="small" /></div>
                        <div className={`text-[9px] mt-1 ${isSelectedYear ? 'text-amber-700' : 'text-slate-500'}`}>{ganjiName}</div>
                      </button>
                    )
                  })}
                </div>
              </div>
              {selectedFortune && (
                <div className="mt-3 bg-amber-50 rounded-xl p-3 sm:p-4">
                  <div className="text-sm font-medium text-amber-700 mb-2">{selectedFortune.year}년 세운: {selectedFortune.fortune?.fortune?.ganjiChar} ({selectedFortune.fortune?.fortune?.ganjiName})</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-white rounded-lg p-2"><span className="text-slate-500">천간 십성: </span><span className="font-medium">{selectedFortune.fortune?.fortune?.tenStar?.stemStar || '-'}</span></div>
                    <div className="bg-white rounded-lg p-2"><span className="text-slate-500">지지 십성: </span><span className="font-medium">{selectedFortune.fortune?.fortune?.tenStar?.branchMainStar || '-'}</span></div>
                  </div>
                  {selectedFortune.fortune?.fortune?.interactions && (<div className="mt-2">{renderInteractions(selectedFortune.fortune.fortune.interactions)}</div>)}
                </div>
              )}
            </div>
          ) : (<div className="text-center py-4 text-slate-400 text-sm">세운 데이터 없음</div>)}
        </div>
      )}
    </div>
  )
}

// ─── 오행 카운트 추출 ───────────────────────────────────
function getFiveElementCounts(result: any): Record<string, number> {
  const counts: Record<string, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 }
  const pillars = [result.pillars.year, result.pillars.month, result.pillars.day, result.pillars.hour]
  for (const p of pillars) {
    if (!p) continue
    if (p.stem?.element && counts[p.stem.element] !== undefined) counts[p.stem.element]++
    if (p.branch?.element && counts[p.branch.element] !== undefined) counts[p.branch.element]++
  }
  return counts
}

// ─── 메인 결과 컴포넌트 ─────────────────────────────────
export default function SajuResult({ result }: { result: any }) {
  if (!result) return null
  const { pillars, dayStem, tenStars, strength, yongsin, daewoon, fortune, gongmang, gwiin, interpretation, monthSolarTerm, meta, input } = result
  const birthYear = input?.year || 1990

  // 광고 잠금 상태 관리
  const [unlockedSections, setUnlockedSections] = useState<Record<string, boolean>>({})

  function handleUnlock(section: string) {
    // TODO: 실제 광고 연동 시 여기서 광고 호출
    // 지금은 즉시 해제 (테스트용)
    setUnlockedSections(prev => ({ ...prev, [section]: true }))
  }

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* ━━━ 무료 영역 ━━━━━━━━━━━━━━━━━━━━ */}

      {/* ① 사주 원국 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-1">📋 사주 원국</h2>
        <p className="text-xs text-slate-400 mb-4">일간: {dayStem.char}({dayStem.name}) · {dayStem.elementKo}/{dayStem.yinYangKo === '양' ? '양(陽)' : '음(陰)'} · 월령: {monthSolarTerm.name}</p>
        <FourPillarsTable pillars={pillars} tenStars={tenStars} />
      </div>

      {/* ② 일간 성격 해석 */}
      <DayStemInterpretation interp={interpretation} />

      {/* ③ 오행 분포 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4">🔥 오행 분포</h2>
        <FiveElementBar counts={getFiveElementCounts(result)} />
      </div>

      {/* ④ 십성 분포 */}
      {tenStars && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4">⭐ 십성 분포</h2>
          <TenStarSection tenStars={tenStars} />
        </div>
      )}

      {/* ⑤ 공망 */}
      <GongmangSection gongmang={gongmang} />

      {/* ⑥ 천을귀인 */}
      <GwiinSection gwiin={gwiin} />

      {/* ⑦ 대운 + 세운 */}
      {daewoon && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 overflow-hidden">
          <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4">🌊 대운 · 세운</h2>
          <DaewoonSection daewoon={daewoon} birthYear={birthYear} input={input} />
        </div>
      )}

      {/* ━━━ 상세 분석 (광고 후 제공) ━━━━━━━━━━━━━━━ */}

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-slate-50 px-4 text-sm font-medium text-slate-500">📊 상세 분석</span>
        </div>
      </div>

      {/* ⑧ 오행 분석 (🔓 광고) */}
      <FiveElementInterpretation
        interp={interpretation}
        isUnlocked={!!unlockedSections['fiveElement']}
        onUnlock={() => handleUnlock('fiveElement')}
      />

      {/* ⑨ 십성 분석 (🔓 광고) */}
      <TenStarInterpretation
        interp={interpretation}
        isUnlocked={!!unlockedSections['tenStar']}
        onUnlock={() => handleUnlock('tenStar')}
      />

      {/* ⑩ 신강/신약 · 용신 (🔓 광고) */}
      <StrengthSection
        strength={strength}
        yongsin={yongsin}
        interp={interpretation}
        isUnlocked={!!unlockedSections['strength']}
        onUnlock={() => handleUnlock('strength')}
      />

      {/* ⑪ 오늘의 운세 (맛보기 + 운세 허브 링크) */}
      <DailyFortuneSection
        interp={interpretation}
        fortune={fortune}
      />

      {/* ⑫ 경고 */}
      {meta.warnings && meta.warnings.length > 0 && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
          <h3 className="text-sm font-medium text-amber-700 mb-2">⚠️ 참고사항</h3>
          <ul className="text-xs text-amber-600 space-y-1">
            {meta.warnings.map((w: string, i: number) => (<li key={i}>• {w}</li>))}
          </ul>
        </div>
      )}

      <div className="text-center text-xs text-slate-300 py-2">engine v{meta.engineVersion} · {new Date(meta.calculatedAt).toLocaleString('ko-KR')}</div>
    </div>
  )
}