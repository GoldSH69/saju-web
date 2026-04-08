import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hashPassword } from '@/lib/board-utils'

type RouteParams = { params: Promise<{ id: string }> }

// ────────────────────────────────────
// GET: 글 상세 (조회수 +1)
// ────────────────────────────────────
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = createAdminClient()

    const { data: post, error } = await supabase
      .from('board_posts')
      .select('id, category_id, title, content, author_type, guest_nickname, is_pinned, view_count, admin_reply, admin_reply_at, created_at, updated_at')
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (error || !post) {
      return NextResponse.json({ error: '게시글을 찾을 수 없습니다' }, { status: 404 })
    }

    // 조회수 +1
    await supabase
      .from('board_posts')
      .update({ view_count: post.view_count + 1 })
      .eq('id', id)

    // 카테고리 정보 조회
    const { data: category } = await supabase
      .from('board_categories')
      .select('slug, name')
      .eq('id', post.category_id)
      .single()

    return NextResponse.json({
      post: {
        ...post,
        view_count: post.view_count + 1,
        category: category || null,
      },
    })
  } catch (error) {
    console.error('Post detail error:', error)
    return NextResponse.json({ error: '게시글 조회 실패' }, { status: 500 })
  }
}

// ────────────────────────────────────
// PATCH: 글 수정 (비회원: 비밀번호 확인)
// ────────────────────────────────────
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = createAdminClient()
    const body = await request.json()
    const { title, content, guest_password } = body

    // 게시글 조회
    const { data: post, error } = await supabase
      .from('board_posts')
      .select('id, author_type, guest_password')
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (error || !post) {
      return NextResponse.json({ error: '게시글을 찾을 수 없습니다' }, { status: 404 })
    }

    // 비회원 비밀번호 확인
    if (post.author_type === 'guest') {
      if (!guest_password || !/^\d{4}$/.test(guest_password)) {
        return NextResponse.json({ error: '비밀번호를 입력해주세요' }, { status: 400 })
      }
      if (hashPassword(guest_password) !== post.guest_password) {
        return NextResponse.json({ error: '비밀번호가 일치하지 않습니다' }, { status: 403 })
      }
    }

    // 입력 검증
    if (title && (title.trim().length < 2 || title.trim().length > 100)) {
      return NextResponse.json({ error: '제목은 2~100자로 입력해주세요' }, { status: 400 })
    }
    if (content && (content.trim().length < 5 || content.trim().length > 5000)) {
      return NextResponse.json({ error: '내용은 5~5000자로 입력해주세요' }, { status: 400 })
    }

    // 수정
    const updateData: Record<string, unknown> = {}
    if (title) updateData.title = title.trim()
    if (content) updateData.content = content.trim()

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: '수정할 내용이 없습니다' }, { status: 400 })
    }

    const { error: updateError } = await supabase
      .from('board_posts')
      .update(updateData)
      .eq('id', id)

    if (updateError) throw updateError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Post update error:', error)
    return NextResponse.json({ error: '수정 실패' }, { status: 500 })
  }
}

// ────────────────────────────────────
// DELETE: 글 삭제 (소프트 삭제, 비회원: 비밀번호 확인)
// ────────────────────────────────────
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = createAdminClient()
    const body = await request.json()
    const { guest_password } = body

    // 게시글 조회
    const { data: post, error } = await supabase
      .from('board_posts')
      .select('id, author_type, guest_password')
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (error || !post) {
      return NextResponse.json({ error: '게시글을 찾을 수 없습니다' }, { status: 404 })
    }

    // 비회원 비밀번호 확인
    if (post.author_type === 'guest') {
      if (!guest_password || !/^\d{4}$/.test(guest_password)) {
        return NextResponse.json({ error: '비밀번호를 입력해주세요' }, { status: 400 })
      }
      if (hashPassword(guest_password) !== post.guest_password) {
        return NextResponse.json({ error: '비밀번호가 일치하지 않습니다' }, { status: 403 })
      }
    }

    // 소프트 삭제
    const { error: deleteError } = await supabase
      .from('board_posts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (deleteError) throw deleteError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Post delete error:', error)
    return NextResponse.json({ error: '삭제 실패' }, { status: 500 })
  }
}