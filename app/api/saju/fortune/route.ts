import { NextRequest, NextResponse } from 'next/server'
import { calculateSaju } from 'saju-engine'
import type { CalculateInput } from 'saju-engine'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // ── Rate Limit: IP당 1분에 5회 ──
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const limit = checkRateLimit(ip, 'saju-fortune', 5, 60)

    if (!limit.allowed) {
      return NextResponse.json(
        { error: `요청이 너무 많습니다. ${limit.resetInSeconds}초 후 다시 시도해주세요.` },
        { status: 429, headers: { 'Retry-After': String(limit.resetInSeconds) } }
      )
    }

    const body = await request.json()
    const { year, month, day, hour, minute, gender, timeOption, birthTimeUnknown, startYear, endYear } = body

    if (!year || !month || !day || !startYear || !endYear) {
      return NextResponse.json({ error: '필수 파라미터 누락' }, { status: 400 })
    }

    // ── 범위 제한: 최대 20년 ──
    if (endYear - startYear > 20) {
      return NextResponse.json({ error: '최대 20년 범위까지 조회 가능합니다' }, { status: 400 })
    }

    const results: any[] = []

    for (let targetYear = startYear; targetYear <= endYear; targetYear++) {
      const input: CalculateInput = {
        year: Number(year),
        month: Number(month),
        day: Number(day),
        hour: birthTimeUnknown ? null : (hour !== null ? Number(hour) : null),
        minute: birthTimeUnknown ? null : (minute !== null ? Number(minute) : null),
        gender: gender || 'male',
        timeOption: timeOption || 'standard30',
        fortuneTargetYear: targetYear,
      }

      const result = calculateSaju(input)

      if (result.fortune?.yearly) {
        results.push({
          year: targetYear,
          fortune: result.fortune.yearly,
        })
      }
    }

    return NextResponse.json({ fortunes: results })
  } catch (err: any) {
    console.error('세운 조회 에러:', err)
    return NextResponse.json(
      { error: '세운 계산 중 오류가 발생했습니다.', detail: err.message },
      { status: 500 }
    )
  }
}