// saju-web/app/learn/page.tsx

import Link from "next/link";
import { learnContents } from "@/data/learn-contents";

export const metadata = {
  title: "사주명리학 배우기 | 사주포럼",
  description:
    "사주명리학의 기초를 무료로 배워보세요. 사주의 구조, 천간과 지지, 오행, 십성까지 체계적으로 알려드립니다.",
};

export default function LearnPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">📚 사주명리학 배우기</h1>
      <p className="text-gray-600 mb-8">
        사주명리학의 기초를 단계별로 배워보세요. 모든 콘텐츠는 무료입니다.
      </p>

      <div className="space-y-4">
        {learnContents
          .sort((a, b) => a.order - b.order)
          .map((content) => (
            <Link
              key={content.slug}
              href={`/learn/${content.slug}`}
              className="block border border-gray-200 rounded-lg p-5 hover:border-purple-400 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{content.emoji}</span>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {content.order}편. {content.title}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {content.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
      </div>

      <div className="mt-10 p-4 bg-purple-50 rounded-lg text-sm text-gray-700">
        💡 기초를 익힌 후{" "}
        <Link href="/" className="text-purple-600 font-semibold hover:underline">
          무료 사주 계산
        </Link>
        으로 직접 확인해 보세요!
      </div>
    </main>
  );
}