import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hashPassword, getClientIP } from '@/lib/board-utils'

// ────────────────────────────────────
// reCAPTCHA v3 검증
// ────────────────────────────────────
async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (!secret) return true  // 키 미설정 시 스킵 (개발용)

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secret}&response=${token}`,
    })
    const data = await res.json()
    return data.success && data.score >= 0.3
  } catch {
    return false
  }
}

// ────────────────────────────────────
// GET: 글 목록 (?category=slug&page=1&limit=20)
// ────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)

    const categorySlug = searchParams.get('category')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const offset = (page - 1) * limit

    if (!categorySlug) {
      return NextResponse.json({ error: 'category 파라미터 필요' }, { status: 400 })
    }

    const { data: category, error: catError } = await supabase
      .from('board_categories')
      .select('*')
      .eq('slug', categorySlug)
      .single()

    if (catError || !category) {
      return NextResponse.json({ error: '카테고리를 찾을 수 없습니다' }, { status: 404 })
    }

    const { count } = await supabase
      .from('board_posts')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', category.id)
      .is('deleted_at', null)

    const { data: posts, error: postsError } = await supabase
      .from('board_posts')
      .select(
        'id, title, author_type, guest_nickname, is_pinned, view_count, admin_reply, created_at'
      )
      .eq('category_id', category.id)
      .is('deleted_at', null)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (postsError) throw postsError

    return NextResponse.json({
      category,
      posts: posts || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error) {
    console.error('Posts fetch error:', error)
    return NextResponse.json({ error: '게시글 조회 실패' }, { status: 500 })
  }
}

// ────────────────────────────────────
// POST: 글 작성
// ────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    const { category_slug, title, content, author_type, guest_nickname, guest_password, recaptchaToken } = body

    // ── reCAPTCHA 검증 ──
    if (!recaptchaToken || !(await verifyRecaptcha(recaptchaToken))) {
      return NextResponse.json({ error: '보안 검증에 실패했습니다. 새로고침 후 다시 시도해주세요' }, { status: 403 })
    }

    // ── 기본 검증 ──
    if (!category_slug || !title || !content || !author_type) {
      return NextResponse.json({ error: '필수 항목을 입력해주세요' }, { status: 400 })
    }
    if (title.trim().length < 2 || title.trim().length > 100) {
      return NextResponse.json({ error: '제목은 2~100자로 입력해주세요' }, { status: 400 })
    }
    if (content.trim().length < 5 || content.trim().length > 5000) {
      return NextResponse.json({ error: '내용은 5~5000자로 입력해주세요' }, { status: 400 })
    }

    // ── 카테고리 확인 ──
    const { data: category, error: catError } = await supabase
      .from('board_categories')
      .select('*')
      .eq('slug', category_slug)
      .single()

    if (catError || !category) {
      return NextResponse.json({ error: '카테고리를 찾을 수 없습니다' }, { status: 404 })
    }
    if (category.admin_only && author_type !== 'admin') {
      return NextResponse.json({ error: '관리자만 작성할 수 있습니다' }, { status: 403 })
    }

    // ── 비회원 검증 ──
    if (author_type === 'guest') {
      if (!category.allow_guest) {
        return NextResponse.json({ error: '비회원 글쓰기가 허용되지 않는 게시판입니다' }, { status: 403 })
      }
      if (!guest_nickname || guest_nickname.trim().length < 2 || guest_nickname.trim().length > 20) {
        return NextResponse.json({ error: '닉네임은 2~20자로 입력해주세요' }, { status: 400 })
      }
      if (!guest_password || !/^\d{4}$/.test(guest_password)) {
        return NextResponse.json({ error: '비밀번호는 숫자 4자리로 입력해주세요' }, { status: 400 })
      }
    }

    // ── 속도 제한 (비회원만) ──
    const ip = getClientIP(request)

    if (author_type === 'guest') {
      const oneMinAgo = new Date(Date.now() - 60_000).toISOString()
      const { data: recent } = await supabase
        .from('board_posts')
        .select('id')
        .eq('ip_address', ip)
        .gte('created_at', oneMinAgo)
        .limit(1)

      if (recent && recent.length > 0) {
        return NextResponse.json({ error: '1분 후에 다시 작성해주세요' }, { status: 429 })
      }

      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)
      const { count: dailyCount } = await supabase
        .from('board_posts')
        .select('*', { count: 'exact', head: true })
        .eq('ip_address', ip)
        .gte('created_at', todayStart.toISOString())

      if ((dailyCount || 0) >= 10) {
        return NextResponse.json({ error: '하루 최대 10건까지 작성할 수 있습니다' }, { status: 429 })
      }
    }

    // ── 저장 ──
    const postData: Record<string, unknown> = {
      category_id: category.id,
      title: title.trim(),
      content: content.trim(),
      author_type,
      ip_address: ip,
    }

    if (author_type === 'guest') {
      postData.guest_nickname = guest_nickname.trim()
      postData.guest_password = hashPassword(guest_password)
    }

    const { data: post, error: insertError } = await supabase
      .from('board_posts')
      .insert(postData)
      .select('id')
      .single()

    if (insertError) throw insertError

    return NextResponse.json({ success: true, id: post.id }, { status: 201 })
  } catch (error) {
    console.error('Post create error:', error)
    return NextResponse.json({ error: '글 작성 실패' }, { status: 500 })
  }
}