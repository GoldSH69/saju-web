import { createHash } from 'crypto'

const SALT = 'saju-board-salt-2024'

export function hashPassword(pw: string): string {
  return createHash('sha256').update(pw + SALT).digest('hex')
}

export function getClientIP(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}