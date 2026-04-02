'use client'

import { useState } from 'react'

// ─── 🔧 FIX 1: 한자→오행 매핑 (대운/세운 색상 보장) ─────
const CHAR_ELEMENT: Record<string, string> = {
  '甲': 'wood', '乙': 'wood', '丙': 'fire', '丁': 'fire',
  '戊': 'earth', '己': 'earth', '庚': 'metal', '辛': 'metal',
  '壬': 'water', '癸': 'water',
  '子': 'water', '丑': 'earth', '寅': 'wood', '卯': 'wood',
  '辰': 'earth', '巳': 'fire', '午': 'fire', '未': 'earth',
  '申': 'metal', '酉': 'metal', '戌': 'earth', '亥': 'water',
}

// ─── 🔧 FIX 1: 오행 색상 (전체 border-2 border-black 통일) ─
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

// ─── 한자 셀 컴포넌트 (오행 색상 적용) ──────────────────
function HanjaCell({ char, element }: { char: string; element: string }) {
  const style = ELEMENT_STYLE[element] || ELEMENT_STYLE.earth
  return (
    <div className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-md ${style.bg}`}>
      <span className={`hanja text-2xl sm:text-3xl font-bold ${style.text}`}>
        {char}
      </span>
    </div>
  )
}

// ─── 소형 한자 셀 (대운/세운용) ─────────────────────────
function SmallHanjaCell({ char, element, size = 'normal' }: { char: string; element: string; size?: 'normal' | 'small' }) {
  // 🔧 FIX 1: CHAR_ELEMENT로 확실한 오행 매핑
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

// ─── 현재 나이/대운 인덱스 ───────────────────────────────
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

// ─── 🔧 FIX 2: 지지 본기(정기) 십성 가져오기 ───────────
function getMainBranchStar(branchStars: any[]): string {
  if (!branchStars || branchStars.length === 0) return ''
  // 배열 순서: [여기(초기), 중기, 정기(본기)]
  // 본기 = 마지막 요소
  return branchStars[branchStars.length - 1]?.tenStar || ''
}

// ─── 4기둥 테이블 ────────────────────────────────────────
function FourPillarsTable({ pillars, tenStars, dayStem }: { pillars: any; tenStars: any; dayStem: any }) {
  const cols = [
    {
      label: '시주',
      pillar: pillars.hour,
      stemStar: tenStars?.hourStem?.tenStar || '',
      branchStar: getMainBranchStar(tenStars?.hourBranchStars),
    },
    {
      label: '일주',
      pillar: pillars.day,
      stemStar: '일간(나)',
      branchStar: getMainBranchStar(tenStars?.dayBranchStars),
    },
    {
      label: '월주',
      pillar: pillars.month,
      stemStar: tenStars?.monthStem?.tenStar || '',
      branchStar: getMainBranchStar(tenStars?.monthBranchStars),
    },
    {
      label: '년주',
      pillar: pillars.year,
      stemStar: tenStars?.yearStem?.tenStar || '',
      branchStar: getMainBranchStar(tenStars?.yearBranchStars),
    },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="mx-auto border-collapse">
        {/* 헤더: 시주/일주/월주/년주 */}
        <thead>
          <tr>
            {cols.map((col, i) => (
              <th key={i} className="px-2 sm:px-4 pb-1 text-xs sm:text-sm font-medium text-slate-500">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* 행1: 천간 십성 */}
          <tr>
            {cols.map((col, i) => (
              <td key={i} className="px-2 sm:px-4 py-0.5 text-center">
                <span className={`text-xs sm:text-sm ${i === 1 ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}>
                  {col.pillar ? col.stemStar : ''}
                </span>
              </td>
            ))}
          </tr>

          {/* 행2: 천간 한자 */}
          <tr>
            {cols.map((col, i) => (
              <td key={i} className="px-2 sm:px-4 py-0.5">
                <div className="flex justify-center">
                  {col.pillar ? (
                    <HanjaCell char={col.pillar.stem.char} element={col.pillar.stem.element} />
                  ) : (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-md border-2 border-dashed border-slate-200">
                      <span className="text-slate-300 text-xs">?</span>
                    </div>
                  )}
                </div>
              </td>
            ))}
          </tr>

          {/* 행3: 지지 한자 */}
          <tr>
            {cols.map((col, i) => (
              <td key={i} className="px-2 sm:px-4 py-0.5">
                <div className="flex justify-center">
                  {col.pillar ? (
                    <HanjaCell char={col.pillar.branch.char} element={col.pillar.branch.element} />
                  ) : (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-md border-2 border-dashed border-slate-200">
                      <span className="text-slate-300 text-xs">?</span>
                    </div>
                  )}
                </div>
              </td>
            ))}
          </tr>

          {/* 행4: 지지 십성 */}
          <tr>
            {cols.map((col, i) => (
              <td key={i} className="px-2 sm:px-4 py-0.5 text-center">
                <span className="text-xs sm:text-sm text-slate-500">
                  {col.pillar ? col.branchStar : ''}
                </span>
              </td>
            ))}
          </tr>

          {/* 행5: 간지 한글 */}
          <tr>
            {cols.map((col, i) => (
              <td key={i} className="px-2 sm:px-4 pt-1 text-center">
                <span className="text-[10px] sm:text-xs text-slate-400">
                  {col.pillar ? col.pillar.ganjiName : ''}
                </span>
              </td>
            ))}
          </tr>
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
            <div
              key={el}
              className={`${BAR_COLORS[el]} flex items-center justify-center text-white text-xs font-bold`}
              style={{ width: `${pct}%`, minWidth: count > 0 ? '24px' : '0' }}
            >
              {count}
            </div>
          )
        })}
      </div>
      <div className="flex flex-wrap justify-center gap-3 text-xs">
        {elements.map(el => {
          const count = counts[el] || 0
          return (
            <div key={el} className="flex items-center gap-1">
              <span className={`w-3 h-3 rounded-full ${BAR_COLORS[el]} ${el === 'metal' ? 'border border-slate-400' : ''}`}></span>
              <span className={count === 0 ? 'text-slate-300' : 'text-slate-600'}>
                {ELEMENT_KO[el]} {count}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── 🔧 FIX 3: 십성 분포 (비화→비겁) ───────────────────
function TenStarSection({ tenStars }: { tenStars: any }) {
  if (!tenStars) return null

  const categories = [
    { key: '비겁', label: '비겁', sub: '比劫', stars: ['비견', '겁재'], color: 'bg-yellow-50 border-yellow-300 text-yellow-800' },
    { key: '식상', label: '식상', sub: '食傷', stars: ['식신', '상관'], color: 'bg-green-50 border-green-300 text-green-800' },
    { key: '재성', label: '재성', sub: '財星', stars: ['편재', '정재'], color: 'bg-blue-50 border-blue-300 text-blue-800' },
    { key: '관성', label: '관성', sub: '官星', stars: ['편관', '정관'], color: 'bg-red-50 border-red-300 text-red-800' },
    { key: '인성', label: '인성', sub: '印星', stars: ['편인', '정인'], color: 'bg-purple-50 border-purple-300 text-purple-800' },
  ]

  // 🔧 FIX 3: categoryCount에서 '비화'→'비겁' 키 매핑
  const categoryCount = { ...tenStars.categoryCount }
  if (categoryCount['비화'] !== undefined && categoryCount['비겁'] === undefined) {
    categoryCount['비겁'] = categoryCount['비화']
  }

  const { starCount, yearStem, monthStem, hourStem } = tenStars

  const positionStars = [
    { pos: '년간', star: yearStem?.tenStar, target: yearStem?.target },
    { pos: '월간', star: monthStem?.tenStar, target: monthStem?.target },
    { pos: '시간', star: hourStem?.tenStar, target: hourStem?.target },
  ]

  const branchPositions = [
    { pos: '년지', stars: tenStars.yearBranchStars },
    { pos: '월지', stars: tenStars.monthBranchStars },
    { pos: '일지', stars: tenStars.dayBranchStars },
    { pos: '시지', stars: tenStars.hourBranchStars },
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
              {cat.stars.map(s => (
                <div key={s}>{s} {starCount[s] || 0}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 rounded-xl p-3">
        <div className="text-xs font-medium text-slate-600 mb-2">천간 십성</div>
        <div className="grid grid-cols-3 gap-1.5 text-xs">
          {positionStars.map(item => (
            <div key={item.pos} className="flex justify-between bg-white rounded-lg px-3 py-2">
              <span className="text-slate-500">{item.pos}</span>
              <span className="font-medium text-slate-800">
                {item.target ? `${item.target} → ${item.star}` : '-'}
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
                    {/* 🔧 FIX 2: 본기 표시 */}
                    {i === item.stars.length - 1 && (
                      <span className="text-indigo-500 text-[9px] ml-1">본기</span>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-slate-300">-</div>
              )}
            </div>
          ))}
        </div>
      </div>
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

  // 대운 선택 시 세운 로드
  async function handleDaewoonClick(index: number) {
    setSelectedIndex(index)
    setSelectedFortuneYear(null)

    const entry = daewoon.entries[index]
    if (!entry) return

    setLoadingFortune(true)
    try {
      const res = await fetch('/api/saju/fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...input,
          startYear: entry.startYear,
          endYear: entry.endYear,
        }),
      })
      const data = await res.json()
      setFortunes(data.fortunes || [])

      // 현재 대운이면 올해를 자동 선택
      if (index === currentIndex) {
        setSelectedFortuneYear(currentYear)
      }
    } catch (err) {
      console.error('세운 로드 실패:', err)
      setFortunes([])
    } finally {
      setLoadingFortune(false)
    }
  }

  // 최초 로드: 현재 대운의 세운 자동 로드
  useState(() => {
    if (currentIndex >= 0) {
      handleDaewoonClick(currentIndex)
    }
  })

  const selectedEntry = selectedIndex >= 0 ? daewoon.entries[selectedIndex] : null
  const selectedFortune = fortunes.find(f => f.year === selectedFortuneYear)

  return (
    <div>
      {/* 정보 */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mb-3">
        <span>{daewoon.direction === 'forward' ? '순행 ▶' : '◀ 역행'}</span>
        <span>·</span>
        <span>대운시작: {daewoon.startAge.description}</span>
        <span>·</span>
        <span className="text-indigo-600 font-medium">현재 만 {currentAge}세</span>
      </div>

      {/* 대운 가로 스크롤 */}
      <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6 pb-3">
        <div className="flex gap-1.5" style={{ minWidth: 'max-content' }}>
          {daewoon.entries.map((entry: any, i: number) => {
            const isCurrent = i === currentIndex
            const isSelected = i === selectedIndex
            // 🔧 FIX 1: 한자로 오행 확실히 결정
            const chars = getGanjiChars(entry)
            const stemEl = CHAR_ELEMENT[chars[0]] || getStemElement(entry)
            const branchEl = CHAR_ELEMENT[chars[1]] || getBranchElement(entry)

            return (
              <button
                key={i}
                onClick={() => handleDaewoonClick(i)}
                className={`flex-shrink-0 text-center px-1.5 py-2 rounded-lg transition cursor-pointer
                  ${isSelected
                    ? 'bg-indigo-100 ring-2 ring-indigo-500'
                    : isCurrent
                      ? 'bg-indigo-50 ring-1 ring-indigo-300'
                      : 'hover:bg-slate-100'
                  }`}
                style={{ minWidth: '52px' }}
              >
                {isCurrent && (
                  <div className="text-[9px] text-indigo-600 font-bold mb-0.5">현재</div>
                )}
                {!isCurrent && <div className="h-3"></div>}

                <div className={`text-[10px] mb-1 ${isSelected ? 'text-indigo-700 font-bold' : 'text-slate-400'}`}>
                  {entry.startAge}~{entry.endAge}세
                </div>

                {/* 천간 */}
                <div className="flex justify-center mb-0.5">
                  <SmallHanjaCell char={chars[0]} element={stemEl} />
                </div>
                {/* 지지 */}
                <div className="flex justify-center">
                  <SmallHanjaCell char={chars[1]} element={branchEl} />
                </div>

                <div className={`text-[10px] mt-1 ${isSelected ? 'text-indigo-700 font-medium' : 'text-slate-500'}`}>
                  {entry.ganjiName}
                </div>
                <div className="text-[9px] text-slate-400">
                  {entry.startYear}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 선택된 대운 상세 */}
      {selectedEntry && (
        <div className="mt-3 bg-indigo-50 rounded-xl p-3 sm:p-4">
          <div className="text-sm font-medium text-indigo-700 mb-1">
            선택 대운: {selectedEntry.ganji} ({selectedEntry.ganjiName})
            · {selectedEntry.startAge}세~{selectedEntry.endAge}세
            ({selectedEntry.startYear}~{selectedEntry.endYear}년)
          </div>
        </div>
      )}

      {/* 세운 */}
      {selectedEntry && (
        <div className="mt-4">
          <h3 className="text-sm font-bold text-slate-700 mb-2">
            📅 세운 ({selectedEntry.startYear}~{selectedEntry.endYear}년)
          </h3>

          {loadingFortune ? (
            <div className="text-center py-4 text-slate-400 text-sm">세운 계산 중...</div>
          ) : fortunes.length > 0 ? (
            <div>
              {/* 세운 목록 */}
              <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6 pb-3">
                <div className="flex gap-1.5" style={{ minWidth: 'max-content' }}>
                  {fortunes.map((f: any) => {
                    const isCurrentYear = f.year === currentYear
                    const isSelectedYear = f.year === selectedFortuneYear
                    const ganjiChar = f.fortune?.fortune?.ganjiChar || ''
                    const ganjiName = f.fortune?.fortune?.ganjiName || ''
                    const stemChar = ganjiChar[0] || ''
                    const branchChar = ganjiChar[1] || ''
                    // 🔧 FIX 1: 한자로 오행 확실히 결정
                    const stemEl = CHAR_ELEMENT[stemChar] || f.fortune?.fortune?.stemElement || 'earth'
                    const branchEl = CHAR_ELEMENT[branchChar] || f.fortune?.fortune?.branchElement || 'earth'

                    return (
                      <button
                        key={f.year}
                        onClick={() => setSelectedFortuneYear(f.year)}
                        className={`flex-shrink-0 text-center px-1.5 py-2 rounded-lg transition cursor-pointer
                          ${isSelectedYear
                            ? 'bg-amber-100 ring-2 ring-amber-500'
                            : isCurrentYear
                              ? 'bg-amber-50 ring-1 ring-amber-300'
                              : 'hover:bg-slate-100'
                          }`}
                        style={{ minWidth: '48px' }}
                      >
                        {isCurrentYear && (
                          <div className="text-[9px] text-amber-600 font-bold mb-0.5">올해</div>
                        )}
                        {!isCurrentYear && <div className="h-3"></div>}

                        <div className={`text-[10px] mb-1 ${isSelectedYear ? 'text-amber-700 font-bold' : 'text-slate-400'}`}>
                          {f.year}년
                        </div>

                        <div className="flex justify-center mb-0.5">
                          <SmallHanjaCell char={stemChar} element={stemEl} size="small" />
                        </div>
                        <div className="flex justify-center">
                          <SmallHanjaCell char={branchChar} element={branchEl} size="small" />
                        </div>

                        <div className={`text-[9px] mt-1 ${isSelectedYear ? 'text-amber-700' : 'text-slate-500'}`}>
                          {ganjiName}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 선택된 세운 상세 */}
              {selectedFortune && (
                <div className="mt-3 bg-amber-50 rounded-xl p-3 sm:p-4">
                  <div className="text-sm font-medium text-amber-700 mb-2">
                    {selectedFortune.year}년 세운: {selectedFortune.fortune?.fortune?.ganjiChar} ({selectedFortune.fortune?.fortune?.ganjiName})
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white rounded-lg p-2">
                      <span className="text-slate-500">천간 십성: </span>
                      <span className="font-medium">{selectedFortune.fortune?.fortune?.tenStar?.stemStar || '-'}</span>
                    </div>
                    <div className="bg-white rounded-lg p-2">
                      <span className="text-slate-500">지지 십성: </span>
                      <span className="font-medium">{selectedFortune.fortune?.fortune?.tenStar?.branchMainStar || '-'}</span>
                    </div>
                  </div>
                  {/* 충합 */}
                  {selectedFortune.fortune?.fortune?.interactions && (
                    <div className="mt-2">
                      {renderInteractions(selectedFortune.fortune.fortune.interactions)}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-slate-400 text-sm">세운 데이터 없음</div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── 충합 표시 헬퍼 ──────────────────────────────────────
function renderInteractions(interactions: any) {
  const items: string[] = []
  if (interactions.stemCombinations?.length) {
    interactions.stemCombinations.forEach((c: any) => items.push(`천간합: ${c.stem1}${c.stem2} → ${c.resultElement || ''}`))
  }
  if (interactions.branchClashes?.length) {
    interactions.branchClashes.forEach((c: any) => items.push(`충: ${c.branch1}${c.branch2}`))
  }
  if (interactions.branchCombines?.length) {
    interactions.branchCombines.forEach((c: any) => items.push(`합: ${c.branch1}${c.branch2} → ${c.resultElement || ''}`))
  }
  if (interactions.branchPunishments?.length) {
    interactions.branchPunishments.forEach((c: any) => items.push(`형: ${c.branch1}${c.branch2}`))
  }
  if (interactions.branchHarms?.length) {
    interactions.branchHarms.forEach((c: any) => items.push(`해: ${c.branch1}${c.branch2}`))
  }

  if (items.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {items.map((item, i) => (
        <span key={i} className="px-2 py-1 bg-white rounded-full text-[10px] text-slate-600 border">
          {item}
        </span>
      ))}
    </div>
  )
}

// ─── 대운 간지에서 오행 추출 헬퍼 ────────────────────────
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

// ─── 메인 결과 컴포넌트 ──────────────────────────────────
export default function SajuResult({ result }: { result: any }) {
  if (!result) return null

  const { pillars, dayStem, tenStars, strength, yongsin, daewoon, monthSolarTerm, meta, input } = result
  const birthYear = input?.year || 1990

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* ① 사주 원국 4기둥 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-1">📋 사주 원국</h2>
        <p className="text-xs text-slate-400 mb-4">
          일간: {dayStem.char}({dayStem.name}) · {dayStem.elementKo}/{dayStem.yinYangKo === '양' ? '양(陽)' : '음(陰)'} · 월령: {monthSolarTerm.name}
        </p>
        <FourPillarsTable pillars={pillars} tenStars={tenStars} dayStem={dayStem} />
      </div>

      {/* ② 오행 분포 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4">🔥 오행 분포</h2>
        <FiveElementBar counts={getFiveElementCounts(result)} />
      </div>

      {/* ③ 십성 분포 */}
      {tenStars && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4">⭐ 십성 분포</h2>
          <TenStarSection tenStars={tenStars} />
        </div>
      )}

      {/* ④ 신강/신약 + 용신 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4">⚖️ 신강/신약 판단</h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className={`px-5 py-2 rounded-full text-lg font-bold text-center
            ${strength.result === '신강' ? 'bg-red-100 text-red-700' :
              strength.result === '신약' ? 'bg-blue-100 text-blue-700' :
              'bg-green-100 text-green-700'}`}
          >
            {strength.result}
          </div>
          <div className="text-sm text-slate-500 text-center sm:text-left">
            <span>돕는 힘 <strong>{strength.helpScore.toFixed(1)}</strong></span>
            <span className="mx-2">vs</span>
            <span>억제 힘 <strong>{strength.restrainScore.toFixed(1)}</strong></span>
            <span className="ml-2 font-medium text-slate-700">
              (차이: {strength.score > 0 ? '+' : ''}{strength.score.toFixed(1)})
            </span>
          </div>
        </div>

        <div className="bg-indigo-50 rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-indigo-600 font-bold">용신(用神)</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-800 text-sm font-medium">
              {yongsin.yongsinKo} ({yongsin.yongsin})
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm">
            <div>
              <span className="text-green-600 font-medium">✅ 좋은 오행: </span>
              <span className="text-slate-700">{yongsin.guide.favorableElements.join(', ')}</span>
            </div>
            <div>
              <span className="text-red-600 font-medium">❌ 나쁜 오행: </span>
              <span className="text-slate-700">{yongsin.guide.unfavorableElements.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ⑤ 대운 + 세운 */}
      {daewoon && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 overflow-hidden">
          <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4">🌊 대운 · 세운</h2>
          <DaewoonSection daewoon={daewoon} birthYear={birthYear} input={input} />
        </div>
      )}

      {/* ⑥ 경고/참고사항 */}
      {meta.warnings && meta.warnings.length > 0 && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
          <h3 className="text-sm font-medium text-amber-700 mb-2">⚠️ 참고사항</h3>
          <ul className="text-xs text-amber-600 space-y-1">
            {meta.warnings.map((w: string, i: number) => (
              <li key={i}>• {w}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-center text-xs text-slate-300 py-2">
        engine v{meta.engineVersion} · {new Date(meta.calculatedAt).toLocaleString('ko-KR')}
      </div>
    </div>
  )
}

// ─── 오행 카운트 추출 ────────────────────────────────────
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