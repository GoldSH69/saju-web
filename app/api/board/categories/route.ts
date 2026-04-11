import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const supabase = createAdminClient()

    const { data: categories, error } = await supabase
      .from('board_categories')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order')

    if (error) throw error

    // 카테고리별 게시글 수 조회
    const result = await Promise.all(
      (categories || []).map(async (cat) => {
        const { count } = await supabase
          .from('board_posts')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', cat.id)
          .is('deleted_at', null)
        return { ...cat, post_count: count || 0 }
      })
    )

    return NextResponse.json({ categories: result })
  } catch (error) {
    console.error('Categories fetch error:', error)
    return NextResponse.json(
      { error: '카테고리 조회 실패' },
      { status: 500 }
    )
  }
}