// saju-web/app/api/board/categories/route.ts
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase.rpc('get_categories_with_count')

    if (error) throw error

    return NextResponse.json({ categories: data })
  } catch (error) {
    console.error('Categories fetch error:', error)
    return NextResponse.json(
      { error: '카테고리 조회 실패' },
      { status: 500 }
    )
  }
}