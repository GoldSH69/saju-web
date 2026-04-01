import { NextRequest, NextResponse } from 'next/server'
import { calculateSaju } from 'saju-engine'
import type { CalculateInput } from 'saju-engine'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { year, month, day, hour, minute, gender, timeOption, birthTimeUnknown, startYear, endYear } = body

    if (!year || !month || !day || !startYear || !endYear) {
      return NextResponse.json({ error: '필수 파라미터 누락' }, { status: 400 })
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