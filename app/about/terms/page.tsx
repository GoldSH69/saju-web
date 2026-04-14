import Link from 'next/link'

export const metadata = {
  title: '이용약관 - 사주명리',
  description: '사주명리 서비스 이용약관',
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">이용약관</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="space-y-6 text-sm text-slate-600 leading-relaxed">

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">제1조 (목적)</h2>
            <p>
              이 약관은 사주명리(이하 "서비스")가 제공하는 사주 분석 관련 서비스의 이용과 관련하여
              서비스와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">제2조 (서비스의 내용)</h2>
            <ol className="list-decimal list-inside space-y-1">
              <li>사주팔자 계산 및 기본 분석 (무료)</li>
              <li>오행·십성 분포 분석 (무료)</li>
              <li>대운·세운 흐름 조회 (무료)</li>
              <li>상세 분석 서비스 (광고 시청 후 제공)</li>
              <li>AI 기반 심층 분석 (유료, 추후 제공 예정)</li>
            </ol>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">제3조 (서비스 이용)</h2>
            <ol className="list-decimal list-inside space-y-1">
              <li>기본 서비스는 회원가입 없이 누구나 이용할 수 있습니다.</li>
              <li>유료 서비스 이용 시 별도의 결제가 필요할 수 있습니다.</li>
              <li>서비스는 이용자의 생년월일시 정보를 기반으로 사주를 계산합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">제4조 (면책사항)</h2>
            <ol className="list-decimal list-inside space-y-1">
              <li>본 서비스는 전통 사주명리학 이론을 기반으로 한 <strong>참고용 정보</strong>를 제공합니다.</li>
              <li>사주 분석 결과는 과학적으로 검증된 것이 아니며, 엔터테인먼트 목적으로 제공됩니다.</li>
              <li>서비스 이용으로 발생하는 어떠한 결과에 대해서도 서비스는 책임을 지지 않습니다.</li>
              <li>중요한 인생의 결정은 반드시 전문가와 상담하시기 바랍니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">제5조 (지적재산권)</h2>
            <ol className="list-decimal list-inside space-y-1">
              <li>서비스가 제공하는 콘텐츠(분석 결과, 해석 텍스트 등)에 대한 저작권은 서비스에 있습니다.</li>
              <li>이용자는 서비스의 콘텐츠를 개인적 용도로만 사용할 수 있으며, 상업적 목적으로 복제·배포할 수 없습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">제6조 (광고)</h2>
            <ol className="list-decimal list-inside space-y-1">
              <li>서비스는 운영을 위해 광고를 게재할 수 있습니다.</li>
              <li>일부 상세 분석 콘텐츠는 광고 시청 후 제공됩니다.</li>
              <li>광고의 내용에 대한 책임은 해당 광고주에게 있습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">제7조 (서비스 변경 및 중단)</h2>
            <ol className="list-decimal list-inside space-y-1">
              <li>서비스는 운영상 필요한 경우 서비스 내용을 변경하거나 중단할 수 있습니다.</li>
              <li>서비스 변경 시 사전에 공지합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">제8조 (약관의 변경)</h2>
            <p>
              본 약관은 필요에 따라 변경될 수 있으며, 변경 시 서비스 내에 공지합니다.
              변경된 약관은 공지 후 7일이 경과한 시점부터 효력이 발생합니다.
            </p>
          </section>

          <div className="pt-4 border-t border-slate-200 text-xs text-slate-400">
            <p>시행일: 2026년 1월 1일</p>
            <p>서비스 이용 중 문의사항이 있으시면 게시판 및 공식 이메일 official@mindground.org를 이용해주세요.</p>
          </div>
        </div>
      </div>

      {/* 하단 링크 */}
      <div className="flex justify-center gap-6 text-sm text-slate-400 py-6">
        <Link href="/about" className="hover:text-slate-600 transition">서비스 소개</Link>
        <span>·</span>
        <Link href="/about/privacy" className="hover:text-slate-600 transition">개인정보처리방침</Link>
      </div>
    </div>
  )
}