import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // IP 추출
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    // Rate Limit: IP당 1분 30회 (페이지 이동 빈도 고려)
    const rateCheck = checkRateLimit(ip, 'tracking', 30, 60)
    if (!rateCheck.allowed) {
      return NextResponse.json({ ok: false }, { status: 429 })
    }

    // body 파싱
    let body: { path?: string; referrer?: string }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
    }

    const { path, referrer } = body

    if (!path || typeof path !== 'string') {
      return NextResponse.json({ ok: false, error: 'path required' }, { status: 400 })
    }

    const userAgent = request.headers.get('user-agent') || null
    const supabase = createAdminClient()

    // ── 1. visitor_logs에 기록 ──
    const { error: logError } = await supabase
      .from('visitor_logs')
      .insert({
        ip_address: ip,
        path: path.slice(0, 500),
        referrer: referrer?.slice(0, 1000) || null,
        user_agent: userAgent?.slice(0, 500) || null,
      })

    if (logError) {
      console.error('[tracking] visitor_logs error:', logError)
      return NextResponse.json({ ok: false }, { status: 500 })
    }

    // ── 2. daily_stats 업데이트 (KST 기준) ──
    const kstNow = new Date(Date.now() + 9 * 60 * 60 * 1000)
    const statDate = kstNow.toISOString().split('T')[0] // YYYY-MM-DD

    // 오늘 이 IP의 첫 방문인지 확인
    const kstTodayStart = `${statDate}T00:00:00+09:00`
    const { count } = await supabase
      .from('visitor_logs')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', ip)
      .gte('created_at', kstTodayStart)

    // 방금 넣은 1건만 있으면 = 오늘 첫 방문
    const isNewVisitor = (count ?? 0) <= 1

    // RPC로 atomic upsert
    const { error: statsError } = await supabase.rpc('upsert_daily_stats', {
      p_date: statDate,
      p_is_new_visitor: isNewVisitor,
    })

    if (statsError) {
      console.error('[tracking] daily_stats error:', statsError)
      // visitor_logs는 이미 기록됨 → stats 실패는 무시
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[tracking] error:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}