import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // saju-engine (로컬 패키지) 서버 외부 패키지 설정
  serverExternalPackages: ['saju-engine'],

  // Next.js 16 Turbopack 기본 설정
  turbopack: {},
};

export default nextConfig;