import { NextRequest, NextResponse } from 'next/server'
import { calculateSaju, generateInterpretation } from 'saju-engine'
import type { CalculateInput } from 'saju-engine'
import { checkRateLimit } from '@/lib/rate-limit'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    // ── Rate Limit: IP당 1분에 10회 ──
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const limit = checkRateLimit(ip, 'saju-calculate', 10, 60)

    if (!limit.allowed) {
      return NextResponse.json(
        { error: `요청이 너무 많습니다. ${limit.resetInSeconds}초 후 다시 시도해주세요.` },
        { status: 429, headers: { 'Retry-After': String(limit.resetInSeconds) } }
      )
    }

    const body = await request.json()
    const { year, month, day, hour, minute, gender, timeOption, birthTimeUnknown } = body

    if (!year || !month || !day) {
      return NextResponse.json(
        { error: '생년월일은 필수입니다.' },
        { status: 400 }
      )
    }

    if (year < 1920 || year > 2050) {
      return NextResponse.json(
        { error: '1920년 ~ 2050년 범위만 지원합니다.' },
        { status: 400 }
      )
    }

    const input: CalculateInput = {
      year: Number(year),
      month: Number(month),
      day: Number(day),
      hour: birthTimeUnknown ? null : (hour !== null ? Number(hour) : null),
      minute: birthTimeUnknown ? null : (minute !== null ? Number(minute) : null),
      gender: gender || 'male',
      timeOption: timeOption || 'standard30',
      fortuneTargetYear: new Date().getFullYear(),
      fortuneTargetMonth: new Date().getMonth() + 1,
      fortuneTargetDay: new Date().getDate(),
    }

    const result = calculateSaju(input)
    const interpretation = generateInterpretation(result)

    // ── saju_calculations 카운트 +1 (fire-and-forget) ──
    try {
      const kstNow = new Date(Date.now() + 9 * 60 * 60 * 1000)
      const statDate = kstNow.toISOString().split('T')[0]
      const supabase = createAdminClient()
      await supabase.rpc('increment_saju_calculations', { p_date: statDate })
    } catch {
      // 통계 실패는 무시 (사주 계산 결과에 영향 없음)
    }

    const response = {
      input: result.input,
      adjustedTime: result.adjustedTime,
      effectiveDate: result.effectiveDate,
      pillars: {
        year: pillarToJson(result.fourPillars.year),
        month: pillarToJson(result.fourPillars.month),
        day: pillarToJson(result.fourPillars.day),
        hour: result.fourPillars.hour ? pillarToJson(result.fourPillars.hour) : null,
      },
      dayStem: result.dayStem,
      hiddenStems: result.hiddenStems,
      fiveElements: result.fiveElements,
      tenStars: {
        dayStem: result.tenStars.dayStem,
        dayStemKorean: result.tenStars.dayStemKorean,
        yearStem: result.tenStars.yearStem,
        monthStem: result.tenStars.monthStem,
        hourStem: result.tenStars.hourStem,
        yearBranchStars: result.tenStars.yearBranchStars,
        monthBranchStars: result.tenStars.monthBranchStars,
        dayBranchStars: result.tenStars.dayBranchStars,
        hourBranchStars: result.tenStars.hourBranchStars,
        allStars: result.tenStars.allStars,
        starCount: result.tenStars.starCount,
        categoryCount: result.tenStars.categoryCount,
      },
      strength: {
        result: result.strength.strength,
        score: result.strength.totalScore,
        helpScore: result.strength.supportScore,
        restrainScore: result.strength.restrainScore,
        level: result.strength.strengthLevel,
        deukryeong: result.strength.deukryeong,
        summary: result.strength.summary,
      },
      yongsin: result.yongsin,
      daewoon: result.daewoon,
      fortune: result.fortune,
      gongmang: result.gongmang ? {
        yearGongmang: result.gongmang.yearGongmang,
        dayGongmang: result.gongmang.dayGongmang,
        branchStatus: result.gongmang.branchStatus,
        summary: result.gongmang.summary,
      } : null,
      gwiin: result.gwiin ? {
        dayStem: result.gwiin.dayStem,
        gwiinPair: result.gwiin.gwiinPair,
        branchStatus: result.gwiin.branchStatus,
        gwiinCount: result.gwiin.gwiinCount,
        gwiinPositions: result.gwiin.gwiinPositions,
        summary: result.gwiin.summary,
      } : null,
      interpretation,
      monthSolarTerm: {
        name: result.monthSolarTerm.name,
        dateTime: result.monthSolarTerm.dateTime,
      },
      meta: result.meta,
    }

    return NextResponse.json(response)
  } catch (err: any) {
    console.error('사주 계산 에러:', err)
    return NextResponse.json(
      { error: '계산 중 오류가 발생했습니다.', detail: err.message },
      { status: 500 }
    )
  }
}

function pillarToJson(p: any) {
  return {
    stem: {
      char: p.heavenlyStem.char,
      name: p.heavenlyStem.name,
      index: p.heavenlyStem.index,
      element: p.heavenlyStem.element,
      elementKo: p.heavenlyStem.elementKo,
      yinYang: p.heavenlyStem.yinYang,
      yinYangKo: p.heavenlyStem.yinYangKo,
    },
    branch: {
      char: p.earthlyBranch.char,
      name: p.earthlyBranch.name,
      index: p.earthlyBranch.index,
      element: p.earthlyBranch.element,
      elementKo: p.earthlyBranch.elementKo,
      yinYang: p.earthlyBranch.yinYang,
      yinYangKo: p.earthlyBranch.yinYangKo,
    },
    ganji: `${p.heavenlyStem.char}${p.earthlyBranch.char}`,
    ganjiName: `${p.heavenlyStem.name}${p.earthlyBranch.name}`,
  }
}