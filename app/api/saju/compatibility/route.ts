import { NextRequest, NextResponse } from 'next/server'
import { calculateSaju, analyzeCompatibility } from 'saju-engine'
import type { CalculateInput } from 'saju-engine'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // ── Rate Limit: IP당 1분에 5회 ──
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const limit = checkRateLimit(ip, 'saju-compatibility', 5, 60)

    if (!limit.allowed) {
      return NextResponse.json(
        { error: `요청이 너무 많습니다. ${limit.resetInSeconds}초 후 다시 시도해주세요.` },
        { status: 429, headers: { 'Retry-After': String(limit.resetInSeconds) } }
      )
    }

    const body = await request.json()
    const { person1, person2 } = body

    // ── 입력 검증 ──
    if (!person1 || !person2) {
      return NextResponse.json(
        { error: '두 사람의 정보가 필요합니다.' },
        { status: 400 }
      )
    }

    for (const [label, p] of [['person1', person1], ['person2', person2]] as const) {
      if (!p.year || !p.month || !p.day) {
        return NextResponse.json(
          { error: `${label}: 생년월일은 필수입니다.` },
          { status: 400 }
        )
      }
      if (p.year < 1920 || p.year > 2050) {
        return NextResponse.json(
          { error: `${label}: 1920년 ~ 2050년 범위만 지원합니다.` },
          { status: 400 }
        )
      }
    }

    // ── 두 사람 각각 사주 계산 ──
    const buildInput = (p: any): CalculateInput => ({
      year: Number(p.year),
      month: Number(p.month),
      day: Number(p.day),
      hour: p.birthTimeUnknown ? null : (p.hour !== null && p.hour !== undefined ? Number(p.hour) : null),
      minute: p.birthTimeUnknown ? null : (p.minute !== null && p.minute !== undefined ? Number(p.minute) : null),
      gender: p.gender || 'male',
      timeOption: p.timeOption || 'standard30',
    })

    const result1 = calculateSaju(buildInput(person1))
    const result2 = calculateSaju(buildInput(person2))

    // ── 궁합 분석 ──
    const compatibility = analyzeCompatibility(
      result1,
      result2,
      person1.name || undefined,
      person2.name || undefined
    )

    // ── 응답 ──
    return NextResponse.json({
      compatibility,
      person1Summary: {
        name: person1.name || null,
        dayStem: result1.dayStem,
        fourPillars: {
          year: pillarShort(result1.fourPillars.year),
          month: pillarShort(result1.fourPillars.month),
          day: pillarShort(result1.fourPillars.day),
          hour: result1.fourPillars.hour ? pillarShort(result1.fourPillars.hour) : null,
        },
      },
      person2Summary: {
        name: person2.name || null,
        dayStem: result2.dayStem,
        fourPillars: {
          year: pillarShort(result2.fourPillars.year),
          month: pillarShort(result2.fourPillars.month),
          day: pillarShort(result2.fourPillars.day),
          hour: result2.fourPillars.hour ? pillarShort(result2.fourPillars.hour) : null,
        },
      },
    })
  } catch (err: any) {
    console.error('궁합 계산 에러:', err)
    return NextResponse.json(
      { error: '계산 중 오류가 발생했습니다.', detail: err.message },
      { status: 500 }
    )
  }
}

function pillarShort(p: any) {
  return {
    stem: { char: p.heavenlyStem.char, name: p.heavenlyStem.name, elementKo: p.heavenlyStem.elementKo },
    branch: { char: p.earthlyBranch.char, name: p.earthlyBranch.name, elementKo: p.earthlyBranch.elementKo },
    ganji: `${p.heavenlyStem.char}${p.earthlyBranch.char}`,
    ganjiName: `${p.heavenlyStem.name}${p.earthlyBranch.name}`,
  }
}