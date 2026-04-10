// saju-web/app/learn/[slug]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { learnContents, getLearnContent } from "@/data/learn-contents";
import LearnBody from "./LearnBody";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return learnContents.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const content = getLearnContent(slug);
  if (!content) return { title: "Not Found" };

  return {
    title: `${content.title} | 사주명리학 배우기`,
    description: content.description,
  };
}

export default async function LearnDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const content = getLearnContent(slug);
  if (!content) notFound();

  const sorted = learnContents.sort((a, b) => a.order - b.order);
  const currentIndex = sorted.findIndex((c) => c.slug === slug);
  const prev = currentIndex > 0 ? sorted[currentIndex - 1] : null;
  const next =
    currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href="/learn"
        className="text-sm text-purple-600 hover:underline mb-4 inline-block"
      >
        ← 목록으로
      </Link>

      <div className="mb-8">
        <span className="text-4xl">{content.emoji}</span>
        <h1 className="text-2xl font-bold mt-2">
          {content.order}편. {content.title}
        </h1>
        <p className="text-gray-500 text-sm mt-1">{content.description}</p>
      </div>

      <LearnBody body={content.body} />

      <nav className="mt-12 flex justify-between items-center border-t pt-6">
        {prev ? (
          <Link
            href={`/learn/${prev.slug}`}
            className="text-sm text-purple-600 hover:underline"
          >
            ← {prev.order}편. {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/learn/${next.slug}`}
            className="text-sm text-purple-600 hover:underline"
          >
            {next.order}편. {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <div className="mt-8 p-4 bg-purple-50 rounded-lg text-sm text-gray-700">
        💡 배운 내용을 직접 확인해 보세요!{" "}
        <Link
          href="/"
          className="text-purple-600 font-semibold hover:underline"
        >
          무료 사주 계산하기
        </Link>
      </div>
    </main>
  );
}