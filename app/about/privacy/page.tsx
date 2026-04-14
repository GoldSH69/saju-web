import Link from 'next/link'

export const metadata = {
  title: '개인정보처리방침 - 사주명리',
  description: '사주명리 서비스 개인정보처리방침',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">개인정보처리방침</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="space-y-6 text-sm text-slate-600 leading-relaxed">

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">1. 개인정보 수집 항목</h2>
            <p className="mb-2">본 서비스는 사주 분석을 위해 다음 정보를 입력받습니다:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>닉네임 (년, 월, 일)</li>
              <li>생년월일 (년, 월, 일)</li>
              <li>출생 시간 (시, 분) — 선택 사항</li>
              <li>성별</li>
            </ul>
            <p className="mt-2 text-xs text-slate-500">
              ※ 위 정보는 이름, 연락처 등 개인을 식별할 수 있는 정보를 포함하지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">2. 개인정보 처리 목적</h2>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>사주팔자 계산 및 분석 결과 제공</li>
              <li>서비스 개선을 위한 통계 분석 (비식별 처리)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">3. 개인정보 보유 및 이용 기간</h2>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>비회원</strong>: 입력된 생년월일시 정보는 서버에 저장되지 않으며, 계산 완료 후 즉시 폐기됩니다.</li>
              <li><strong>회원</strong> (추후 제공): 회원 탈퇴 시까지 보유하며, 탈퇴 시 즉시 삭제합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">4. 개인정보의 제3자 제공</h2>
            <p>본 서비스는 이용자의 개인정보를 제3자에게 제공하지 않습니다.</p>
            <p className="mt-1">단, 다음의 경우에는 예외로 합니다:</p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-1">
              <li>법령에 의해 요구되는 경우</li>
              <li>이용자가 사전에 동의한 경우</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">5. 쿠키 및 자동 수집 정보</h2>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>localStorage</strong>: 이용자가 "입력값 저장"을 선택한 경우, 브라우저에 생년월일시 정보를 저장합니다. 이 정보는 서버로 전송되지 않습니다.</li>
              <li><strong>광고 쿠키</strong>: Google AdSense 등 광고 서비스에서 쿠키를 사용할 수 있습니다. 이는 맞춤형 광고 제공을 위한 것이며, Google의 개인정보처리방침을 따릅니다.</li>
              <li><strong>분석 도구</strong>: 서비스 개선을 위해 방문자 통계를 수집할 수 있으며, 이는 비식별 정보만 포함합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">6. 이용자의 권리</h2>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>브라우저의 localStorage를 삭제하여 저장된 입력값을 제거할 수 있습니다.</li>
              <li>브라우저 설정에서 쿠키를 차단할 수 있습니다.</li>
              <li>개인정보 관련 문의는 게시판을 통해 접수할 수 있습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">7. 개인정보 보호책임자 MindGround</h2>
            <p>개인정보 관련 문의는 게시판 또는 공식 이메일 official@mindground.org를 이용해주시기 바랍니다.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-800 mb-2">8. 방침 변경</h2>
            <p>
              본 개인정보처리방침은 법령 변경이나 서비스 변경에 따라 수정될 수 있으며,
              변경 시 서비스 내에 공지합니다.
            </p>
          </section>

          <div className="pt-4 border-t border-slate-200 text-xs text-slate-400">
            <p>시행일: 2026년 1월 1일</p>
          </div>
        </div>
      </div>

      {/* 하단 링크 */}
      <div className="flex justify-center gap-6 text-sm text-slate-400 py-6">
        <Link href="/about" className="hover:text-slate-600 transition">서비스 소개</Link>
        <span>·</span>
        <Link href="/about/terms" className="hover:text-slate-600 transition">이용약관</Link>
      </div>
    </div>
  )
}