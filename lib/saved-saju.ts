// lib/saved-saju.ts
// 사주 정보 다중 저장 유틸 (localStorage, 최대 10명)

export interface SavedSajuEntry {
  id: string
  name: string              // 별명 ("나", "엄마", "친구" 등)
  gender: 'male' | 'female'
  year: number
  month: number
  day: number
  hour: number | null
  minute: number | null
  timeOption: 'standard30' | 'none'
  birthTimeUnknown: boolean
  savedAt: string           // ISO string
  lastViewedAt: string      // ISO string
}

const STORAGE_KEY = 'saju-saved-list'
const MAX_ENTRIES = 10

// ─── 간단 ID 생성 ─────────────────────────────────
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}

// ─── 전체 목록 조회 (최근 조회순 정렬) ─────────────
export function getSavedSajuList(): SavedSajuEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    const list: SavedSajuEntry[] = JSON.parse(data)
    // 최근 조회순 정렬
    return list.sort(
      (a, b) => new Date(b.lastViewedAt).getTime() - new Date(a.lastViewedAt).getTime()
    )
  } catch {
    return []
  }
}

// ─── 저장 개수 확인 ────────────────────────────────
export function getSavedCount(): number {
  return getSavedSajuList().length
}

export function isSavedFull(): boolean {
  return getSavedCount() >= MAX_ENTRIES
}

// ─── 중복 확인 (같은 생년월일시 + 성별) ────────────
export function findDuplicate(
  gender: string, year: number, month: number, day: number,
  hour: number | null, minute: number | null
): SavedSajuEntry | null {
  const list = getSavedSajuList()
  return list.find(e =>
    e.gender === gender &&
    e.year === year && e.month === month && e.day === day &&
    e.hour === hour && e.minute === minute
  ) || null
}

// ─── 저장 (신규 추가) ──────────────────────────────
// 성공 시 entry 반환, 가득 차면 null 반환
export function saveSajuEntry(
  entry: Omit<SavedSajuEntry, 'id' | 'savedAt' | 'lastViewedAt'>
): SavedSajuEntry | null {
  const list = getSavedSajuList()

  // 중복 체크 → 이미 있으면 이름 업데이트 후 반환
  const dup = list.find(e =>
    e.gender === entry.gender &&
    e.year === entry.year && e.month === entry.month && e.day === entry.day &&
    e.hour === entry.hour && e.minute === entry.minute
  )
  if (dup) {
    dup.name = entry.name
    dup.lastViewedAt = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    return dup
  }

  // 가득 찬 경우
  if (list.length >= MAX_ENTRIES) {
    return null
  }

  // 신규 추가
  const now = new Date().toISOString()
  const newEntry: SavedSajuEntry = {
    ...entry,
    id: generateId(),
    savedAt: now,
    lastViewedAt: now,
  }
  list.push(newEntry)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  return newEntry
}

// ─── 삭제 ──────────────────────────────────────────
export function deleteSajuEntry(id: string): void {
  const list = getSavedSajuList().filter(e => e.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

// ─── 이름 수정 ────────────────────────────────────
export function renameSajuEntry(id: string, newName: string): void {
  const list = getSavedSajuList()
  const entry = list.find(e => e.id === id)
  if (entry) {
    entry.name = newName
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  }
}

// ─── 마지막 조회 시간 갱신 ─────────────────────────
export function updateLastViewed(id: string): void {
  const list = getSavedSajuList()
  const entry = list.find(e => e.id === id)
  if (entry) {
    entry.lastViewedAt = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  }
}

// ─── 마지막으로 본 사주 가져오기 ───────────────────
export function getLastViewedEntry(): SavedSajuEntry | null {
  const list = getSavedSajuList()
  return list.length > 0 ? list[0] : null  // 이미 최근순 정렬됨
}

// ─── ID로 조회 ─────────────────────────────────────
export function getSajuEntryById(id: string): SavedSajuEntry | null {
  const list = getSavedSajuList()
  return list.find(e => e.id === id) || null
}

// ─── 전체 삭제 ─────────────────────────────────────
export function clearAllSajuEntries(): void {
  localStorage.removeItem(STORAGE_KEY)
}

// ─── 기존 데이터 마이그레이션 ──────────────────────
// 기존 'saju-form-saved' (1명) → 새 리스트로 이전
export function migrateOldSavedData(): void {
  try {
    const oldData = localStorage.getItem('saju-form-saved')
    if (!oldData) return

    const old = JSON.parse(oldData)

    // 이미 마이그레이션 했는지 확인
    const dup = findDuplicate(
      old.gender, old.year, old.month, old.day,
      old.birthTimeUnknown ? null : old.hour,
      old.birthTimeUnknown ? null : old.minute
    )

    if (!dup) {
      saveSajuEntry({
        name: '나',
        gender: old.gender,
        year: old.year,
        month: old.month,
        day: old.day,
        hour: old.birthTimeUnknown ? null : old.hour,
        minute: old.birthTimeUnknown ? null : old.minute,
        timeOption: old.timeOption || 'standard30',
        birthTimeUnknown: old.birthTimeUnknown || false,
      })
    }

    // 기존 키 제거
    localStorage.removeItem('saju-form-saved')
  } catch {
    // 무시
  }
}

// ─── 마지막 계산 입력값 자동 저장 ──────────────────
// (사주리스트와 별개, 페이지 이동 시 복원용)

const LAST_CALC_KEY = 'saju-last-calculated'

export interface LastCalculatedData {
  name?: string             // 저장된 사주의 별명 (없으면 미표시)
  year: number
  month: number
  day: number
  hour: number | null
  minute: number | null
  gender: 'male' | 'female'
  timeOption: 'standard30' | 'none'
  birthTimeUnknown: boolean
}

export function saveLastCalculated(data: LastCalculatedData): void {
  try {
    localStorage.setItem(LAST_CALC_KEY, JSON.stringify(data))
  } catch {
    // 무시
  }
}

export function getLastCalculated(): LastCalculatedData | null {
  try {
    const data = localStorage.getItem(LAST_CALC_KEY)
    if (!data) return null
    return JSON.parse(data)
  } catch {
    return null
  }
}