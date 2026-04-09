// 메모리 기반 Rate Limiter (Vercel serverless 환경용)
const ipRequestMap = new Map<string, { count: number; resetTime: number }>()

// 5분마다 만료된 항목 정리
setInterval(() => {
  const now = Date.now()
  for (const [key, val] of ipRequestMap) {
    if (now > val.resetTime) ipRequestMap.delete(key)
  }
}, 5 * 60 * 1000)

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetInSeconds: number
}

export function checkRateLimit(
  ip: string,
  endpoint: string,
  maxRequests: number,
  windowSeconds: number
): RateLimitResult {
  const key = `${ip}:${endpoint}`
  const now = Date.now()
  const windowMs = windowSeconds * 1000

  const record = ipRequestMap.get(key)

  // 첫 요청 또는 윈도우 만료
  if (!record || now > record.resetTime) {
    ipRequestMap.set(key, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1, resetInSeconds: windowSeconds }
  }

  // 제한 초과
  if (record.count >= maxRequests) {
    const resetIn = Math.ceil((record.resetTime - now) / 1000)
    return { allowed: false, remaining: 0, resetInSeconds: resetIn }
  }

  // 카운트 증가
  record.count++
  const resetIn = Math.ceil((record.resetTime - now) / 1000)
  return { allowed: true, remaining: maxRequests - record.count, resetInSeconds: resetIn }
}