'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  getSavedSajuList,
  deleteSajuEntry,
  renameSajuEntry,
  clearAllSajuEntries,
  SavedSajuEntry,
} from '@/lib/saved-saju'

export default function SavedSajuClient() {
  const router = useRouter()
  const [list, setList] = useState<SavedSajuEntry[]>([])
  const [loaded, setLoaded] = useState(false)

  // 이름 수정 상태
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  // 삭제 확인
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  // 전체 삭제 확인
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  useEffect(() => {
    setList(getSavedSajuList())
    setLoaded(true)
  }, [])

  function refreshList() {
    setList(getSavedSajuList())
  }

  // ─── 사주 보기 (홈으로 이동) ──────────────────────
  function handleView(entry: SavedSajuEntry) {
    router.push(`/?id=${entry.id}`)
  }

  // ─── 이름 수정 ────────────────────────────────────
  function startRename(entry: SavedSajuEntry) {
    setEditingId(entry.id)
    setEditName(entry.name)
  }

  function confirmRename() {
    if (editingId && editName.trim()) {
      renameSajuEntry(editingId, editName.trim())
      refreshList()
    }
    setEditingId(null)
    setEditName('')
  }

  // ─── 삭제 ─────────────────────────────────────────
  function handleDelete(id: string) {
    deleteSajuEntry(id)
    setDeleteConfirmId(null)
    refreshList()
  }

  // ─── 전체 삭제 ────────────────────────────────────
  function handleClearAll() {
    clearAllSajuEntries()
    setShowClearConfirm(false)
    refreshList()
  }

  // ─── 표시 헬퍼 ────────────────────────────────────
  function formatBirth(e: SavedSajuEntry): string {
    const date = `${e.year}.${String(e.month).padStart(2, '0')}.${String(e.day).padStart(2, '0')}`
    if (e.birthTimeUnknown) return `${date} (시간 모름)`
    const time = `${String(e.hour ?? 0).padStart(2, '0')}:${String(e.minute ?? 0).padStart(2, '0')}`
    return `${date} ${time}`
  }

  function formatDate(iso: string): string {
    const d = new Date(iso)
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  }

  if (!loaded) return null

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-slate-800 mb-2">📋 사주리스트</h1>
      <p className="text-sm text-slate-500 mb-6">
        저장된 사주를 클릭하면 바로 결과를 확인할 수 있습니다. (최대 10명)
      </p>

      {/* 빈 상태 */}
      {list.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-slate-500 mb-2">저장된 사주가 없습니다</p>
          <p className="text-sm text-slate-400 mb-6">
            홈에서 사주를 계산한 후 &quot;💾 이 사주 저장하기&quot; 버튼을 눌러주세요.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
          >
            🔮 사주 보러 가기
          </button>
        </div>
      )}

      {/* 리스트 */}
      {list.length > 0 && (
        <>
          <div className="space-y-3">
            {list.map((entry) => (
              <div
                key={entry.id}
                className="bg-white border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition"
              >
                {/* 이름 수정 모드 */}
                {editingId === entry.id ? (
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && confirmRename()}
                      maxLength={20}
                      className="flex-1 px-3 py-1.5 border border-indigo-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      autoFocus
                    />
                    <button onClick={confirmRename} className="text-sm text-indigo-600 font-medium">확인</button>
                    <button onClick={() => setEditingId(null)} className="text-sm text-slate-400">취소</button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{entry.gender === 'male' ? '👨' : '👩'}</span>
                      <span className="font-bold text-slate-800">{entry.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startRename(entry)}
                        className="text-xs text-slate-400 hover:text-indigo-600 px-2 py-1"
                        title="이름 수정"
                      >
                        ✏️
                      </button>
                      {deleteConfirmId === entry.id ? (
                        <span className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="text-xs text-red-600 font-medium px-2 py-1"
                          >
                            삭제 확인
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="text-xs text-slate-400 px-2 py-1"
                          >
                            취소
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(entry.id)}
                          className="text-xs text-slate-400 hover:text-red-500 px-2 py-1"
                          title="삭제"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* 생년월일 + 클릭 영역 */}
                <button
                  onClick={() => handleView(entry)}
                  className="w-full text-left"
                >
                  <p className="text-sm text-slate-600">
                    {formatBirth(entry)}
                    {entry.timeOption === 'standard30' && !entry.birthTimeUnknown && (
                      <span className="ml-2 text-xs text-indigo-500">30분보정</span>
                    )}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    저장: {formatDate(entry.savedAt)} · 최근 조회: {formatDate(entry.lastViewedAt)}
                  </p>
                </button>
              </div>
            ))}
          </div>

          {/* 하단: 개수 + 전체 삭제 */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
            <span className="text-sm text-slate-400">
              {list.length}/10명 저장됨
            </span>
            {showClearConfirm ? (
              <span className="flex items-center gap-2">
                <span className="text-sm text-red-600">전체 삭제할까요?</span>
                <button
                  onClick={handleClearAll}
                  className="text-sm text-red-600 font-bold px-3 py-1 border border-red-300 rounded-lg"
                >
                  삭제
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="text-sm text-slate-400 px-3 py-1"
                >
                  취소
                </button>
              </span>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="text-sm text-slate-400 hover:text-red-500 transition"
              >
                🗑️ 전체 삭제
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}