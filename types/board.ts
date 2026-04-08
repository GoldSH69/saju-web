export interface BoardCategory {
  id: string
  slug: string
  name: string
  description: string | null
  allow_guest: boolean
  admin_only: boolean
  sort_order: number
  created_at: string
  post_count?: number
}

export interface BoardPost {
  id: string
  category_id: string
  title: string
  content: string
  author_type: 'member' | 'guest' | 'admin'
  author_id: string | null
  guest_nickname: string | null
  is_pinned: boolean
  view_count: number
  admin_reply: string | null
  admin_reply_at: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  category?: { slug: string; name: string }
}

export interface BoardPostListResponse {
  category: BoardCategory
  posts: BoardPost[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CreatePostRequest {
  category_slug: string
  title: string
  content: string
  author_type: 'guest' | 'admin'
  guest_nickname?: string
  guest_password?: string
}