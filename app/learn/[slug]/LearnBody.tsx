// saju-web/app/learn/[slug]/LearnBody.tsx

"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function LearnBody({ body }: { body: string }) {
  return (
    <article className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-a:text-purple-600 prose-blockquote:border-purple-300 prose-blockquote:bg-purple-50 prose-blockquote:py-1 prose-blockquote:rounded">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
    </article>
  );
}