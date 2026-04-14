import Link from 'next/link'

export const metadata = {
  title: '소개 - 사주명리',
  description: '만세력 기반 무료 사주 분석 서비스 소개',
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* 서비스 소개 */}
      <h1 className="text-2xl font-bold text-slate-800 mb-6">🔮 사주명리 소개</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-3">서비스 소개</h2>
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>
            <strong>사주명리</strong>는 만세력(萬歲曆) 기반의 정확한 사주팔자 계산과
            분석을 제공하는 무료 웹서비스입니다.
          </p>
          <p>
            전통 사주명리학의 이론을 바탕으로, 천문학적 절기 데이터(1920~2050년)를
            활용하여 정확한 사주 원국을 계산합니다.
          </p>
          <p>
            누구나 무료로 자신의 사주를 확인하고, 오행과 십성의 분포를 통해
            자신의 성격과 운세의 흐름을 파악할 수 있습니다.
          </p>
        </div>
      </div>

      {/* 제공 기능 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">제공 기능</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: '📋', title: '사주 원국', desc: '년·월·일·시 4기둥 계산' },
            { icon: '🧑', title: '일간 성격', desc: '일간(日干) 기반 성격 분석' },
            { icon: '🔥', title: '오행 분포', desc: '목·화·토·금·수 분석' },
            { icon: '⭐', title: '십성 분포', desc: '비겁·식상·재성·관성·인성' },
            { icon: '🕳️', title: '공망 분석', desc: '년공망·일공망 판단' },
            { icon: '🌟', title: '천을귀인', desc: '귀인 위치 확인' },
            { icon: '🌊', title: '대운·세운', desc: '10년 대운 + 매년 세운' },
            { icon: '🔮', title: '오늘의 운세', desc: '일간 기반 매일 운세' },
            { icon: '⚖️', title: '신강/신약', desc: '일간 강약 + 용신 판단' },
            { icon: '📊', title: '상세 분석', desc: '오행·십성 심층 해석' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-slate-50 rounded-xl p-3">
              <span className="text-xl">{item.icon}</span>
              <div>
                <div className="text-sm font-bold text-slate-700">{item.title}</div>
                <div className="text-xs text-slate-500">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 계산 기준 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-3">계산 기준</h2>
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span><strong>양력(태양력)</strong> 기준 계산</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span><strong>천문학적 절기 데이터</strong> (1920~2050년, 시·분 단위)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span><strong>한국 표준시(KST) 30분 보정</strong> 기본 적용</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span><strong>년주</strong>: 입춘 기준 (절입시각 적용)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span><strong>월주</strong>: 12절기 절입시각 기준</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span><strong>일주</strong>: 율리우스 적일(JDN) 기반</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span><strong>자시(子時)</strong>: 야자시 기본 적용</span>
          </div>
        </div>
      </div>

      {/* 면책 */}
      <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-amber-800 mb-3">⚠️ 안내사항</h2>
        <div className="space-y-2 text-sm text-amber-700">
          <p>본 서비스는 전통 사주명리학 이론을 기반으로 한 <strong>참고용 정보</strong>를 제공합니다.</p>
          <p>사주 분석 결과는 절대적인 것이 아니며, 중요한 결정에 대해서는 전문가와 상담하시기 바랍니다.</p>
          <p>운세와 성격 분석은 엔터테인먼트 목적으로 제공됩니다.</p>
        </div>
      </div>

      {/* 문의 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-3">📮 문의</h2>
        <div className="text-sm text-slate-600 space-y-2">
          <p>서비스 이용 중 문의사항이 있으시면 게시판 및 공식 이메일 official@mindground.org를 이용해주세요.</p>
          <Link href="/board" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
            게시판 바로가기
          </Link>
        </div>
      </div>

      {/* 하단 링크 */}
      <div className="flex justify-center gap-6 text-sm text-slate-400 py-4">
        <Link href="/about/terms" className="hover:text-slate-600 transition">이용약관</Link>
        <span>·</span>
        <Link href="/about/privacy" className="hover:text-slate-600 transition">개인정보처리방침</Link>
      </div>
    </div>
  )
}