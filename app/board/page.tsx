import Link from 'next/link'

export const metadata = {
  title: '게시판 - 사주명리',
  description: '사주명리 서비스 게시판 - 공지사항, FAQ, 의견/건의',
}

const BOARD_CATEGORIES = [
  {
    key: 'notice',
    icon: '📢',
    title: '공지사항',
    desc: '서비스 업데이트 및 중요 안내',
    writer: '관리자',
    color: 'bg-red-50 border-red-200',
  },
  {
    key: 'faq',
    icon: '❓',
    title: 'FAQ',
    desc: '자주 묻는 질문과 답변',
    writer: '관리자',
    color: 'bg-amber-50 border-amber-200',
  },
  {
    key: 'feedback',
    icon: '💬',
    title: '의견/건의',
    desc: '서비스 개선을 위한 의견을 남겨주세요',
    writer: '누구나',
    color: 'bg-blue-50 border-blue-200',
  },
  {
    key: 'bug',
    icon: '🐛',
    title: '버그 신고',
    desc: '오류나 문제가 있으면 알려주세요',
    writer: '누구나',
    color: 'bg-orange-50 border-orange-200',
  },
  {
    key: 'free',
    icon: '💭',
    title: '자유게시판',
    desc: '사주, 운세 등 자유로운 이야기',
    writer: '누구나',
    color: 'bg-green-50 border-green-200',
  },
]

export default function BoardPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">📋 게시판</h1>

      {/* 준비 중 안내 */}
      <div className="bg-indigo-50 rounded-2xl border border-indigo-200 p-5 mb-6 text-center">
        <p className="text-lg font-bold text-indigo-700 mb-1">🚧 게시판 준비 중입니다</p>
        <p className="text-sm text-indigo-500">곧 오픈 예정입니다. 조금만 기다려주세요!</p>
      </div>

      {/* 카테고리 목록 */}
      <div className="space-y-3">
        {BOARD_CATEGORIES.map((cat) => (
          <div
            key={cat.key}
            className={`rounded-2xl border p-4 sm:p-5 ${cat.color} opacity-80`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{cat.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-base font-bold text-slate-800">{cat.title}</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white text-slate-500 border border-slate-200">
                    {cat.writer}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{cat.desc}</p>
              </div>
              <div className="text-slate-300 text-sm">준비 중</div>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 안내 */}
      <div className="mt-8 text-center text-sm text-slate-400 space-y-1">
        <p>게시판 오픈 전까지 문의사항은 아래를 참고해주세요.</p>
        <div className="flex justify-center gap-4 pt-2">
          <Link href="/about" className="text-indigo-500 hover:text-indigo-700 transition">
            서비스 소개
          </Link>
          <Link href="/about/terms" className="text-indigo-500 hover:text-indigo-700 transition">
            이용약관
          </Link>
          <Link href="/about/privacy" className="text-indigo-500 hover:text-indigo-700 transition">
            개인정보처리방침
          </Link>
        </div>
      </div>
    </div>
  )
}